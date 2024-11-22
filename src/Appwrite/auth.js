import { Client, Account, ID  } from "appwrite";
import conf from "./config.js";
import { login as authLogin, logout } from "../ReduxStore/auth.js";
import { Users } from "node-appwrite";

class AuthService {
  client = new Client();
  creators = new Users(this.client); // Use this.client to initialize Users correctly
  account;

  constructor() {
    this.client.setEndpoint(conf.endpointURL).setProject(conf.projectId)
    this.account = new Account(this.client);
  }

  // Sign-up function
  async signup({ email, password, fullName, PP ,username }, navigate, dispatch) {
    try {
      const userInfo = await this.account.create(ID.unique(), email, password ,username );
     
      if (userInfo) {
        const session = await this.login({ email, password }, navigate);

        await this.updateUserPrefs(fullName, PP);

        // return session;
      }else{
        return userInfo
      }
    } catch (error) {
      console.error(
        `Failed to sign up user with email ${email}: ${error.message}`
      );
      return error
    }
  }

  async updateUserPrefs(fullName, PP) {
    try {
      await this.account.updatePrefs({
        fullName: fullName,
        profilePicture: PP,
        status: 'active'
        
      });
      console.log("User preferences updated successfully.");
    } catch (error) {
      console.error(`Failed to update user preferences: ${error.message}`);
    }
  }

  

  async login({ email, password }, navigate) {
    try {
      // Delete all sessions before logging in
      await this.deleteAllSessions();
    } catch (error) {
      throw new Error(`Failed to check or delete sessions: ${error.message}`);
    }
  
    try {
      // Create a new session
      const newSession = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log("Logged in:", newSession);
  
      // Fetch current user data
      const userData = await this.getCurrUserData();
  
      if (userData) {
        navigate("/");
        // Return both session and userInfo
        return { session: newSession, userInfo: userData };
      }
    } catch (error) {
      console.error(`Failed to log in user: ${error.message}`);
     return error
    }
  }
  

  async createEmailVerification() {
    try {
      return await this.account.createVerification(
        "https://localhost:5173/verify"
      );
    } catch (error) {
      throw new Error(`Failed to send email verification: ${error.message}`);
    }
  }

  // async createCreatorAccount() {
  //   try {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const secret = urlParams.get("secret");
  //     const userId = urlParams.get("userId");

  //     if (secret && userId) {
  //       const verification = await this.account.updateVerification(
  //         userId,
  //         secret
  //       );

  //       if (verification) {
  //         console.log("User verified successfully");

  //         const userData = await this.getCurrUserData();
  //         if (userData && !userData.labels.includes("creator")) {
  //           await this.account.updateLabels(userId, ["creator"]);
  //           console.log("User marked as creator");
  //         } else if (!userData) {
  //           await this.login(
  //             { email: userData.email, password: userData.password },
  //             navigate
  //           );
  //         }
  //       }

  //       return verification;
  //     } else {
  //       throw new Error("Missing userId or secret in URL parameters.");
  //     }
  //   } catch (error) {
  //     throw new Error(
  //       `Failed to process creator account verification: ${error.message}`
  //     );
  //   }
  // }

 
  
  // Usage example
 
  async deleteAllSessions() {
    try {

      const sessions= await this.account.listSessions()
      if(sessions.total > 0) {
        await this.account.deleteSessions();
        console.log("Deleted existing sessions.");
      }

     
    } catch (error) {
      console.error(`Failed to check or delete sessions: ${error.message}`);
    }
  }

  async getCurrUserData() {
    try {
      const session = await this.account.get();
      return session;
    } catch (error) {
      if (error.code === 404) {
        return null;
      }
      throw new Error(`Failed to get current session: ${error.message}`);
    }
  }

  async createPasswordRecovery({ email }) {
    try {
      return await this.account.createRecovery(
        email,
        " "
      );
    } catch (error) {
      throw new Error(
        `Failed to recover password in the appwrite server, error: ${error.message}`
      );
    }
  }

  async updatePassword({ password, confirmPassword }) {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get("secret");
      const userId = urlParams.get("userId");

      if (secret && userId) {
        return await this.account.updateRecovery(
          userId,
          secret,
          password,
          confirmPassword
        );
      } else {
        throw new Error("Missing userId or secret in URL parameters.");
      }
    } catch (error) {
      throw new Error(
        `Failed to update email recovery in the appwrite server, error: ${error.message}`
      );
    }
  }

  async logout(dispatch, navigate) {
    try {
      const empty =  await this.deleteAllSessions();
      if(empty){
        dispatch(logout());
        navigate("/login");

      }
    } catch (error) {
      throw new Error(`Failed to log out user: ${error.message}`);
    }
  }
}

const authService = new AuthService();

export default authService;

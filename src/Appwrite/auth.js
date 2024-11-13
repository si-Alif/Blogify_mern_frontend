import { Client, Account, ID } from "appwrite";
import conf from "./config.js";
import { login as authLogin, logout } from "../ReduxStore/auth.js";

class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.endpointURL)
      .setProject(conf.projectId);
    this.account = new Account(this.client);
  }

  async signup({ email, password, fullName }, navigate, dispatch) {
    try {
        // Create a new user
        const userInfo = await this.account.create(
            ID.unique(),
            email,
            password,
            fullName
        );

        if (userInfo) {
            // Call login to create session and update Redux state
            await this.login({ email, password }, navigate, dispatch, false); // Skip session check
            return userInfo;
        }
    } catch (error) {
        throw new Error(
            `Failed to sign up user with email ${email}: ${error.message}`
        );
    }
}


async getCurrUserData() {
    try {
        // Fetch current session if the user is logged in
        const session = await this.account.get();
        return session
    } catch (error) {
        if (error.code === 404) {
            return null;
        }
        throw new Error(
            `Failed to get session from the Appwrite server: error: ${error.message}`
        );
    }
}

// New method to delete active sessions
async deleteAllSessions() {
  try {
      await this.account.deleteSessions();
  } catch (error) {
      throw new Error(
          `Failed to delete sessions: ${error.message}`
      );
  }
}


async login({ email, password }, navigate, checkSession = true) {
    await this.deleteAllSessions();
  try {
      // Delete active sessions to avoid conflicts

      // Create a new session for the user
      const newSession = await this.account.createEmailPasswordSession(email, password);
      console.log(newSession) 
       
      const userData= await this.getCurrUserData(newSession.$id)
      
      if (newSession && userData) {
          // Dispatch setAuthState to store session and user info in Redux
          

          navigate("/");
          return newSession;
      }
  } catch (error) {
      throw new Error(
          `Failed to login user with email ${email}: ${error.message}`
      );
  }
}

  
  
  async createEmailVerification() {
    try {
      return await this.account.createVerification(
        "https://localhost:5173/verify"
      );
    } catch (error) {
      throw new Error(
        `Failed to verify email in the appwrite server : error: ${error.message}`
      );
    }
  }

  async createCreatorAccount() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get("secret");
      const userId = urlParams.get("userId");

      if (secret && userId) {
        return await this.account.updateVerification(userId, secret);
      } else {
        throw new Error("Missing userId or secret in URL parameters.");
      }
    } catch (error) {
      throw new Error(
        `Failed to create creator account in the appwrite server, error: ${error.message}`
      );
    }
  }

  async createPasswordRecovery({ email }) {
    try {
      return await this.account.createRecovery(
        email,
        "https://localhost:5173/reset-password"
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
        // Delete all sessions to log the user out
        await this.deleteAllSessions();

        // Dispatch clearAuthState to reset auth data in Redux
        dispatch(logout());
        navigate("/login"); // Redirect to login page after logout
    } catch (error) {
        throw new Error(
            `Failed to log out user: ${error.message}`
        );
    }
}

}

const authService = new AuthService();

export default authService;

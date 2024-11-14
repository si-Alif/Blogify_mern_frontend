import { Client, Account, ID } from "appwrite";
import conf from "./config.js";
import { login as authLogin, logout } from "../ReduxStore/auth.js";

class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(conf.endpointURL).setProject(conf.projectId);
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
        // Send a verification email to the user for initial account creation
        await this.createEmailVerification();

        console.log("Verification email sent. Please check your inbox.");
        return userInfo; // Wait for email verification before login
      }
    } catch (error) {
      throw new Error(
        `Failed to sign up user with email ${email}: ${error.message}`
      );
    }
  }

  async login({ email, password }, navigate) {
    const sessions = await this.account.listSessions();
    if (sessions.total > 0) {
      await this.deleteAllSessions();
    }

    try {
      const newSession = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log("Logged in:", newSession);

      const userData = await this.getCurrUserData();

      if (userData) {
        navigate("/");
        return newSession;
      }
    } catch (error) {
      console.log(`Failed to log in user: ${error.message}`);
      return error.message;
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

  async createCreatorAccount() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get("secret");
      const userId = urlParams.get("userId");

      if (secret && userId) {
        // Complete the verification process
        const verification = await this.account.updateVerification(
          userId,
          secret
        );

        if (verification) {
          console.log("User verified successfully");

          // Check if the user is already registered or requesting creator status
          const userData = await this.getCurrUserData();
          if (userData && !userData.labels.includes("creator")) {
            // If user is logged in and does not have "creator" label, assign it
            await this.account.updateLabels(userId, ["creator"]);
            console.log("User marked as creator");
          } else if (!userData) {
            // If this is a new account creation, proceed with auto-login
            await this.login(
              { email: userData.email, password: userData.password },
              navigate
            );
          }
        }

        return verification;
      } else {
        throw new Error("Missing userId or secret in URL parameters.");
      }
    } catch (error) {
      throw new Error(
        `Failed to process creator account verification: ${error.message}`
      );
    }
  }

  async deleteAllSessions() {
    try {
      await this.account.deleteSessions()
      console.log("Deleted existing sessions.");
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
      throw new Error(`Failed to log out user: ${error.message}`);
    }
  }
}

const authService = new AuthService();

export default authService;

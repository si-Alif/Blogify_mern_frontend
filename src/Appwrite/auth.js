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
      // Create user
      const userInfo = await this.account.create(
        ID.unique(),
        email,
        password,
        fullName
      );
  
      // Directly attempt login after successful user creation
      if (userInfo) {
        await this.login({ email, password }, navigate, dispatch, false); // Pass `false` to skip session check
        return userInfo;
      }
    } catch (error) {
      throw new Error(
        `Failed to sign up user with email in the Appwrite server: ${email}, error: ${error.message}`
      );
    }
  }
  
  async getCurrUserData() {
    try {
      // Fetch current session if the user is logged in
      const session = await this.account.get();
      return session;
    } catch (error) {
      if (error.code === 404) {
        return null;
      }
      throw new Error(
        `Failed to get session from the Appwrite server: error: ${error.message}`
      );
    }
  }
  
  async login({ email, password }, navigate, dispatch, checkSession = true) {
    try {
      // Check if there's already an active session only if checkSession is true
      if (checkSession) {
        const session = await this.getCurrUserData();
        if (session) {
          dispatch(authLogin(session));
          navigate("/");
          return session;
        }
      }
  
      // If no session exists, or if skip session check, create a new one
      const newSession = await this.account.createEmailPasswordSession(email, password);
      if (newSession) {
        dispatch(authLogin(newSession));
        navigate("/");
        return newSession;
      }
    } catch (error) {
      throw new Error(
        `Failed to login user with email in the Appwrite server: ${email}, error: ${error.message}`
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

    async logout() {
    try {
      await this.account.deleteSessions("current");
    } catch (error) {
      throw new Error(
        `Failed to logout user in the appwrite server, error: ${error.message}`
      );
    }
  }
}

const authService = new AuthService();

export default authService;

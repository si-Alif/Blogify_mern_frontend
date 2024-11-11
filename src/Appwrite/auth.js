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
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        fullName
      );

      if (user) {
        this.login({ email, password }, navigate, dispatch);
      }
    } catch (error) {
      throw new Error(
        `Failed to signup user with email in the appwrite server : ${email}, error: ${error.message}`
      );
    }
  }

  async getCurrSession() {
    try {
      const session = await this.account.getSession("current");
      if (session) {
        console.log(session);
        return session;
      }
    } catch (error) {
      throw new Error(
        `Failed to get session from the appwrite server: error: ${error.message}`
      );
    }
  }

  async login({ email, password }, navigate, dispatch) {
    const session = await this.getCurrSession();
    if (session) {
      navigate("/");
    } else {
      try {
        const userInfo = await this.account.createEmailPasswordSession(
          email,
          password
        );
        if (userInfo) {
          dispatch(authLogin(userInfo));
          navigate("/");
          return userInfo;
        }
      } catch (error) {
        throw new Error(
          `Failed to login user with email in the appwrite server: ${email}, error: ${error.message}`
        );
      }
    }
  }

  async creatorEmailVerification() {
    try {
      return await this.account.createVerification(
        "https://localhost:5173/verify"
      );
    } catch (error) {
      throw new Error(
        `Failed to verify email in the appwrite server :  error: ${error.message}`
      );
    }
  }

  async ctreateCreatorAccount() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get("secret");
      const userId = urlParams.get("userId");

      if (secret && userId) {
        return await this.account.updateVerification(userId, secret);
      } else if (!userId || !secret) {
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
        "https://localhost:5173/reset-password" //to be updated
      );
    } catch (error) {
      throw new Error(
        `Failed to recover password in the appwrite server, error: ${error.message}`
      );
    }
  }

  async updatePassword({ password, confirmPassword }) {
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
      } else if (!userId || !secret) {
        throw new Error("Missing userId or secret in URL parameters .");
      }
    } catch (error) {
      throw new Error(
        `Failed to update email recovery in the appwrite server, error: ${error.message}`
      );
    }
  }

  async getCurrentUser({ userId }) {
    try {
      const user = await this.account.get(userId);
      console.log(user);
      if (user) return user;
    } catch (error) {
      throw new Error(
        `Failed to get user in the appwrite server, error: ${error.message}`
      );
    }
  }

  async deactivateUser() {
    try {
      return await this.account.updateStatus();
    } catch (error) {
      throw new Error(
        `Failed to deactivate user in the appwrite server, error: ${error.message}`
      );
    }
  }

  async deleteUser({ userId }) {
    try {
      await this.account.delete(userId);
    } catch (error) {
      throw new Error(
        `Failed to delete user in the appwrite server, error: ${error.message}`
      );
    }
  }

  async getCurrentUserSession() {
    return await this.account.getSession("current");
  }

  async logout() {
    await this.account.deleteSessions("current");
  }
}

const authService = new AuthService();

export default authService;

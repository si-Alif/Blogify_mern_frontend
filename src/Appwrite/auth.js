import { Client, Account, ID  } from "appwrite";
import conf from "./config.js";
import { login as authLogin, logout } from "../ReduxStore/auth.js";
import { Users } from "node-appwrite";
import axios from "axios";

class AuthService {
  client = new Client();
  creators = new Users(this.client); // Use this.client to initialize Users correctly
  account;

  constructor() {
    this.client.setEndpoint(conf.endpointURL).setProject(conf.projectId)
    this.account = new Account(this.client);
  }

  async signup({ email, password, fullName, avatar, username }) {
    try {

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("fullName", fullName);
      formData.append("username", username);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const userInfo = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (userInfo) {
        console.log(userInfo);

        const userData = await this.login({ email, password });

        if (userData) return userData

      }
    } catch (error) {
      console.error(
        `Failed to sign up user with email ${email}: ${error.message}`
      );
      return error;
    }
  }


  async login({ email, password }) {

    try {

      console.log(email);


      const loggedIn = await axios.post("http://localhost:8000/api/v1/user/login", { email, password }, { withCredentials: true });


      if(loggedIn) console.log(loggedIn.data.data?.user);

      return loggedIn.data?.data.user

    } catch (error) {
      console.error(`Failed to log in user: ${error.message}`);
     return null
    }
  }

  async logout() {
    try {
     await axios.post("http://localhost:8000/api/v1/user/logout" , {} , {withCredentials: true})


    } catch (error) {
      throw new Error(`Failed to log out user: ${error.message}`);
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


  async getCurrUserData() {
    try {
      const session = await axios.get("http://localhost:8000/api/v1/user/current-user", {
        withCredentials: true, 
      });
      return session;
    } catch (error) {
      if (error.code === 404) {
        return null;
      }
      throw new Error(`Failed to get current session: ${error.message}`);
    }
  }

  async updateUserPrefs(newPrefs) {
    try {
      const session = await axios.put("http://localhost:8000/api/v1/user/update-info",
        newPrefs,
        {
          withCredentials: true,
          headers: {
             "Content-Type": "multipart/form-data" },

        });

      console.log(session);
      console.log("User preferences updated successfully.");
    } catch (error) {
      console.error(`Failed to update user preferences: ${error.message}`);
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

}

const authService = new AuthService();

export default authService;

// AdminService.js
import { Client, Users, Query, Databases } from "node-appwrite";
import conf from "./config.js";

class AdminService {
    client = new Client();
    creators;
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.endpointURL)
            .setProject(conf.projectId)
            .setKey(conf.apikeysecret); // Set API key securely

        this.creators = new Users(this.client); // Appwrite Users instance
        this.databases = new Databases(this.client); // Appwrite Databases instance
    }

    // Fetch all admin users with a specific label
    async getAdminUsers(label) {
        try {
            let allUsers = [];
            let page = 0;
            const limit = 25; // Limit per page

            while (true) {
                const result = await this.creators.list([
                    Query.limit(limit),
                    Query.offset(page * limit),
                ]);

                allUsers = allUsers.concat(result.users);

                if (result.users.length < limit) break; // Stop when no more users
                page++;
            }

            // Filter users with the specific label
            const adminUsers = allUsers.filter(
                (user) =>
                    Array.isArray(user.labels) && user.labels.includes(label)
            );

            return adminUsers;
        } catch (error) {
            console.error("Error fetching admin users:", error);
            return [];
        }
    }

    // Add "creator" label to a user
    async getCreatorLabel(id) {
        try {
            const creator = await this.creators.updateLabels(id, ["creator"]);
            return creator;
        } catch (error) {
            throw new Error(`Error fetching creator label: ${error.message}`);
        }
    }

    // Retrieve specific attribute based on userId and attribute condition
    async postInteractions(userId) {
      try {
          // Fetch documents from the database collection with the filters
          const response = await this.creators.get(
            userId
          )
          
  
          if (response) {
              // Extract required attributes from the matched documents
              return response
          } else {
              throw new Error("No matching document found.");
          }
      } catch (error) {
          throw new Error(`Error retrieving data: ${error.message}`);
      }
  }

  
  
}

export default new AdminService();

import { Client, Databases, ID, Query } from "appwrite";
import conf from "./config.js";

export class DataBase {
  client = new Client();
  databases;
  constructor() {
    this.client.setEndpoint(conf.endpointURL).setProject(conf.projectId);
    this.databases = new Databases(this.client);
  }

  async createPost({
    title,
    tags,
    content,
    userId,
    status,
    featuredImage,
    createdBy = "",
  }) {
    try {
      const response = await this.databases.createDocument(
        conf.databaseId,
        conf.collectionId,
        ID.unique(),
        {
          title,
          tags,
          content,
          userId,
          status,
          featuredImage,
          createdBy,
        }
      );
      if (response) {
        return response;
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      throw new Error("Error creating post: " + error.message);
    }
  }

  async getAllposts(query = []) {
    try {
      const response = await this.databases.listDocuments(
        conf.databaseId,
        conf.collectionId,
        [Query.equal("status", "active"), query]
      );
      if (response) {
        return response.documents;
      } else {
        this.throwError("Failed to list documents");
      }
    } catch (error) {
      throw new Error("Error fetching posts: " + error.message);
    }
  }

  async getPost(postId) {
    try {
      const response = await this.databases.getDocument(
        conf.databaseId,
        conf.collectionId,
        postId
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to get document in appwrite");
      }
    } catch (error) {
      throw new Error("Error fetching post: " + error.message);
    }
  }

  async updatePost(postId, data) {
    try {
      const response = await this.databases.updateDocument(
        conf.databaseId,
        conf.collectionId,
        postId,
        {
          ...data,
        }
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to update document appwrite");
      }
    } catch (error) {
      throw new Error("Error updating post: " + error.message);
    }
  }

  async postLike(postId, userId) {
    const uuid= ID.unique()
    try {
      console.log(conf.postLikes)
      const response = await this.databases.createDocument(
        conf.databaseId,
        conf.postLikes,
        uuid,
        {
          docId:uuid,
          postId:postId,
          userId: userId,

        }

      );
      if (response) {
        console.log(response)
        return response
      } else {
        this.throwError("Failed to update document appwrite");
      }
    } catch (error) {
      throw new Error(
        "Error updating post: " + error.message
      )
    }
  }
  
  async postDisLike(postId, userId) {
    const uuid= ID.unique()
    try {
      console.log(conf.postLikes)
      const response = await this.databases.createDocument(
        conf.databaseId,
        conf.postDislikes,
        uuid,
        {
          docId:uuid,
          postId:postId,
          userId: userId,

        }

      );
      if (response) {
        return response
      } else {
        this.throwError("Failed to update document appwrite");
      }
    } catch (error) {
      throw new Error(
        "Error updating post: " + error.message
      )
    }
  }
  async postComments(postId, userId , comment) {
    const uuid= ID.unique()
    try {
      console.log(conf.postLikes)
      const response = await this.databases.createDocument(
        conf.databaseId,
        conf.postComments,
        uuid,
        {
          docId:uuid,
          postId:postId,
          userId: userId,
          comment
        }

      );
      if (response) {
        return response
      } else {
        this.throwError("Failed to update document appwrite");
      }
    } catch (error) {
      throw new Error(
        "Error updating post: " + error.message
      )
    }
  }

  async updateComment(data) {
    try {
      const response = await this.databases.updateDocument(
        conf.databaseId,
        conf.postComments,
        data.docId,
       
        {
          ...data,
        }
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to update document appwrite");
      }
    } catch (error) {
      throw new Error("Error updating post: " + error.message);
    }
  }

  async getAllLikes(postId) {
    try {
      const response = await this.databases.listDocuments(
        conf.databaseId,
        conf.postLikes,
        [Query.equal("postId", postId)]
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to list documents");
      }
    } catch (error) {
      throw new Error("Error fetching likes: " + error.message);
    }
  }
  async getAllDislikes(postId) {
    try {
      const response = await this.databases.listDocuments(
        conf.databaseId,
        conf.postDislikes,
        [Query.equal("postId", postId)]
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to list documents");
      }
    } catch (error) {
      throw new Error("Error fetching likes: " + error.message);
    }
  }
  async getAllComments(postId) {
    try {
      const response = await this.databases.listDocuments(
        conf.databaseId,
        conf.postComments,
        [Query.equal("postId", postId)]
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to list documents");
      }
    } catch (error) {
      throw new Error("Error fetching likes: " + error.message);
    }
  }

  async deletePost(postId) {
    try {
      const response = await this.databases.deleteDocument(
        conf.databaseId,
        conf.collectionId,
        postId
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to delete document appwrite");
      }
    } catch (error) {
      throw new Error("Error deleting post: " + error.message);
    }
  }
  async unLikePost(likeId) {
    try {
      const response = await this.databases.deleteDocument(
        conf.databaseId,
        conf.postLikes,
        likeId
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to delete document appwrite");
      }
    } catch (error) {
      throw new Error("Error unliking: " + error.message);
    }
  }
  async unDislikePost(likeId) {
    try {
      const response = await this.databases.deleteDocument(
        conf.databaseId,
        conf.postDislikes,
        likeId
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to delete document appwrite");
      }
    } catch (error) {
      throw new Error("Error unliking: " + error.message);
    }
  }
  async deleteComment(docId) {
    try {
      const response = await this.databases.deleteDocument(
        conf.databaseId,
        conf.postComments,
        docId
      );
      if (response) {
        return response;
      } else {
        this.throwError("Failed to delete document appwrite");
      }
    } catch (error) {
      throw new Error("Error unliking: " + error.message);
    }
  }
}

const databaseService = new DataBase();

export default databaseService;

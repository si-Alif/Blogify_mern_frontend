import { Storage, Client, ID } from "appwrite";
import conf from "./config.js";



export class StorageServ {
  client = new Client();
  storage;

  constructor() {
    this.client.setEndpoint(conf.endpointURL).setProject(conf.projectId);
    this.storage = new Storage(this.client);
    
    
  }

  // async uploadFile( image ) {
  //   try {
  //     return await this.storage.createFile(conf.bucketId, ID.unique(), image);
  //   } catch (error) {
  //     throw new Error(
  //       `Failed to upload image with id ${image} to the appwrite server : ${error.message}`
  //     );
  //   }
  // }

  async uploadFile(file){
    
    // once we upload the file we will get an json object where we will get an object which later on we will pass it to the          🗿🗿🗿 createpost's userId parameter as a refrence of the uploaded file
    try {
      return await this.storage.createFile(
        conf.bucketId,
        ID.unique(),
        file

      )
    } catch (error) {
      throw new Error (
        `Error while uploading a file ::Error:: ${error.message}`
      )
      return false
    }
  }
  async uploadProfilePicture(PP){
    
    // once we upload the file we will get an json object where we will get an object which later on we will pass it to the          🗿🗿🗿 createpost's userId parameter as a refrence of the uploaded file
    try {
      return await this.storage.createFile(
        conf.PPbucketId,
        ID.unique(),
        PP

      )
    } catch (error) {
      throw new Error (
        `Error while uploading a file ::Error:: ${error.message}`
      )
      return false
    }
  }
  async getFeaturedFile( fileId ) {
    try {
      return await this.storage.getFile(conf.bucketId, fileId);
    } catch (error) {
      throw new Error(
        `Failed to get featured image with id ${fileId} from the appwrite server : ${error.message}`
      );
    }
  }

  async deleteFile(fileId) {
    try {
      const fileExists = await this.storage.getFile(conf.bucketId, fileId);
      if (!fileExists) {
        console.warn(`File with ID ${fileId} does not exist on the server.`);
        return;
      }
      return this.storage.deleteFile(conf.bucketId, fileId);
    } catch (error) {
      if (error.code === 404) {
        console.warn(`File with ID ${fileId} not found on server.`);
      } else {
        throw new Error(`Failed to delete image with id ${fileId} from the Appwrite server: ${error.message}`);
      }
    }
  }


  async downloadFile({ fileId }) {
    try {
      return await this.storage.getFileDownload(conf.bucketId, fileId);
    } catch (error) {
      throw new Error(
        `Failed to download image with id ${fileId} from the appwrite server : ${error.message}`
      );
    }
  }

  async filePreview( fileId ) {
    try {
      return await this.storage.getFilePreview(conf.bucketId, fileId);
    } catch (error) {
      throw new Error(
        `Failed to get preview of image with id ${fileId} from the appwrite server : ${error.message}`
      );
    }
  }
  async previewPP( fileId ) {

    try {
      return await this.storage.getFilePreview(conf.PPbucketId, fileId);
    } catch (error) {
      throw new Error(
        `Failed to get preview of image with id ${fileId} from the appwrite server : ${error.message}`
      );
    }
  }
}


const storageService = new StorageServ()

export default storageService
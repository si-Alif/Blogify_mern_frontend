const conf = {
  endpointURL:String( import.meta.env.VITE_APPWRITE_ENDPOINT_URL),
  projectId:String( import.meta.env.VITE_APPWRITE_PROJECT_ID),
  bucketId:String( import.meta.env.VITE_APPWRITE_BUCKET_ID),
  databaseId:String( import.meta.env.VITE_APPWRITE_DATABASE_ID),
  collectionId:String( import.meta.env.VITE_APPWRITE_COLLECTION_ID)
};
export default conf;


// //.env file

// VITE_APPWRITE_ENDPOINT_URL = "https://cloud.appwrite.io/v1"
// VITE_APPWRITE_PJOJECT_ID = "672fb198002ea7e46d96"
// VITE_APPWRITE_BUCKET_ID ="672fb4e6002c2fac13a9"
// VITE_APPWRITE_DATABASE_ID ="672fb3040030441757fd"
// VITE_APPWRITE_COLLECTION_ID ="672fb3370034990a86d3"

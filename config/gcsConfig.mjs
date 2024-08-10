import { Storage } from '@google-cloud/storage';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Initialize Google Cloud Storage with your service account key file
const storage = new Storage({
    keyFilename: path.join(path.resolve(), process.env.GOOGLE_CLOUD_KEYFILE_PATH), // Path to the service account key file
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID // Your Google Cloud project ID
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Your bucket name
const bucket = storage.bucket(bucketName);

// Function to upload a file to Google Cloud Storage
const uploadFileToGCS = async (filePath, destination) => {
    try {
        // Upload file to the bucket
        await bucket.upload(filePath, {
            destination, // Destination path in the bucket
            public: true // If you want the file to be publicly accessible
        });
        console.log(`${filePath} uploaded to ${bucketName}`);
    } catch (error) {
        // Log error if file upload fails
        console.error('Error uploading file to GCS:', error);
    }
};

export default uploadFileToGCS;

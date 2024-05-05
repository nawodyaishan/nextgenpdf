import AWS, { S3 } from 'aws-sdk';
import { AwsConfig } from '@/config/aws-config';
import { FileUploadResponse } from '@/types/file-upload-response';

export abstract class AwsUtilsLib {
  private static s3Service: S3 | null = null;

  // Make the constructor private to prevent instantiation.
  private constructor() {}

  /**
   * Initializes the S3 service if it hasn't been initialized yet.
   * Ensures that only one instance of the S3 service is created (singleton pattern).
   */
  public static async getS3Service(): Promise<S3> {
    if (!this.s3Service) {
      try {
        AWS.config.update({ credentials: AwsConfig.awsCredentials, region: 'us-east-1' });
        console.log('AWS Bucket Name:', AwsConfig.awsS3BucketName);
        console.log('AWS Credentials:', AwsConfig.awsCredentials);

        this.s3Service = new AWS.S3({
          params: { Bucket: AwsConfig.awsS3BucketName },
        });
      } catch (error) {
        console.error('Failed to initialize S3 service:', error);
        throw error;
      }
    }
    return this.s3Service;
  }

  /**
   * Uploads a file to Amazon S3 and returns details about the upload.
   *
   * @param fileToUpload The file to be uploaded.
   * @param onProgress Callback function to handle progress updates.
   * @returns A promise that resolves to an object containing details of the uploaded file.
   * @throws Error if the upload process fails.
   */
  public static async uploadToAwsS3(
    fileToUpload: File,
    onProgress: (percent: number) => void,
  ): Promise<FileUploadResponse> {
    console.log('Uploading file to AWS S3:', fileToUpload.name);
    try {
      const s3 = await this.getS3Service();
      const fileKey = `uploads/${Date.now()}-${fileToUpload.name.replace(/\s/g, '-')}`;
      const params = {
        Bucket: AwsConfig.awsS3BucketName,
        Key: fileKey,
        Body: fileToUpload,
      };

      const upload = s3.upload(params).on('httpUploadProgress', (event) => {
        const percent = Math.floor((event.loaded * 100) / event.total);
        console.log(`Uploading... ${percent}% complete`);
        onProgress(percent);
      });

      const data = await upload.promise();
      console.log('Upload successful:', data);
      return {
        fileKey,
        fileName: fileToUpload.name,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  /**
   * Generates a public URL for a file in S3.
   *
   * This method does not generate a temporary, signed URL and should be used with caution
   * for publicly accessible files only.
   *
   * @param {string} fileKey The key (name) of the file in S3.
   * @returns {string} The public URL for the file.
   */
  public static getS3Url(fileKey: string) {
    const url = `https://${AwsConfig.awsS3BucketName}.s3.${AwsConfig.awsS3BucketRegion}.amazonaws.com/${fileKey}`;
  }

  /**
   * Generates a temporary, signed URL for accessing a file in S3.
   *
   * This method is generally more secure than using a public URL, as it allows access to the file
   * only for a limited time period.
   *
   * @param {string} fileKey The key (name) of the file in S3.
   * @returns {string} The temporary, signed URL for the file.
   * @throws {Error} If there is an error generating the signed URL.
   */
  public static getSignedUrl(fileKey: string): string {
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    const params = {
      Bucket: AwsConfig.awsS3BucketName,
      Key: fileKey,
      Expires: 3600,
    };

    try {
      return s3.getSignedUrl('getObject', params);
    } catch (error: any) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  public static async downloadFileFromS3(fileKey: string, fileName: string) {
    try {
      const s3 = await this.getS3Service();
    } catch (error: any) {}
  }
}

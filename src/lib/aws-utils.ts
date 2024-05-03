import AWS from 'aws-sdk';
import { AwsConfig } from '@/config/aws-config';
import { FileUploadResponse } from '@/types/file-upload-response';

export abstract class AwsUtilsLib {
  /**
   * Uploads a file to Amazon S3.
   *
   * @param {File} fileToUpload The file to upload.
   * @returns {Promise<FileUploadResponse>} A promise that resolves to an object containing the uploaded file's key and name.
   * @throws {Error} If there is an error during the upload process.
   */
  public static async uploadToAwsS3(fileToUpload: File): Promise<Awaited<FileUploadResponse>> {
    console.log('📁 - Uploading file To Aws S3', fileToUpload.name);
    try {
      AWS.config.update({ credentials: AwsConfig.awsCredentials });
      const s3Service = new AWS.S3({
        params: {
          Bucket: AwsConfig.awsS3BucketName,
        },
        region: 'us-east-1',
      });
      const fileKey = `uploads/${Date.now().toString()}-${fileToUpload.name.replace(/\s/g, '-')}`;
      const putObjectParams = {
        Bucket: AwsConfig.awsS3BucketName,
        Key: fileKey,
        Body: fileToUpload,
      };
      const uploadPromise = s3Service
        .putObject(putObjectParams)
        .on('httpUploadProgress', (event) => {
          console.log(
            `🚀 - Uploading to S3 Bucket.... ${parseInt(((event.loaded * 100) / event.total).toString())}%`,
          );
        })
        .promise();

      await uploadPromise.then((data) => {
        console.log('✅ - Upload successful:', fileKey, data.$response);
      });

      return Promise.resolve({
        fileKey,
        fileName: fileToUpload.name,
      });
    } catch (error) {
      console.error('❌ - Upload failed:', error);
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
}

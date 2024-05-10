export abstract class AwsConfig {
  public static readonly awsCredentials = {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? '',
  };
  public static readonly awsS3BucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? '';
  public static readonly awsS3BucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION ?? '';
}

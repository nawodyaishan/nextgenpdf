import { EnvUtils } from '@/utils/env-utils';

export abstract class AwsConfig {
  public static readonly awsCredentials = {
    accessKeyId: EnvUtils.readString('NEXT_PUBLIC_AWS_ACCESS_KEY_ID'),
    secretAccessKey: EnvUtils.readString('NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY'),
  };
  public static readonly awsS3BucketName = EnvUtils.readString('NEXT_PUBLIC_AWS_BUCKET_NAME');
  public static readonly awsS3BucketRegion = EnvUtils.readString('NEXT_PUBLIC_AWS_BUCKET_REGION');
}

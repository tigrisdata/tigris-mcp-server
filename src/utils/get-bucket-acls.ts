import { S3Client } from '@aws-sdk/client-s3';
import { GetBucketAclCommand } from '@aws-sdk/client-s3';

export const getBucketAcl = async (S3: S3Client, bucketName: string) => {
  return S3.send(new GetBucketAclCommand({ Bucket: bucketName }));
};

export const isBucketPublic = async (S3: S3Client, bucketName: string) => {
  const acl = await getBucketAcl(S3, bucketName);
  return acl.Grants?.some(
    grant =>
      grant.Grantee?.Type === 'Group' &&
      grant.Grantee?.URI === 'http://acs.amazonaws.com/groups/global/AllUsers',
  );
};

import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect, AnyPrincipal } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { rebuildSite } from './functions/rebuild-site/resource.js';

/**
 * AQUA CMS - Backend設定
 * 認証、データ、ストレージ、再構築機能のリソースを統合
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  rebuildSite,
});

// S3バケットのパブリックリードアクセスを有効化
const { cfnBucket } = backend.storage.resources.cfnResources;
cfnBucket.publicAccessBlockConfiguration = {
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
};

// バケットポリシーでパブリックリードアクセスを明示的に許可
backend.storage.resources.bucket.addToResourcePolicy(
  new PolicyStatement({
    sid: 'AllowPublicReadAccess',
    effect: Effect.ALLOW,
    principals: [new AnyPrincipal()],
    actions: ['s3:GetObject'],
    resources: [`${backend.storage.resources.bucket.bucketArn}/public/*`],
  })
);
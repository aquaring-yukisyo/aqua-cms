import { defineBackend } from '@aws-amplify/backend';
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

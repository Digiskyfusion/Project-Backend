import { createRequire } from 'node:module';
import admin from 'firebase-admin';

const require = createRequire(import.meta.url);
const serviceAccount = require('./firebaseAdminSDK.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
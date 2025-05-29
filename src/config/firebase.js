import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
const base64Key = process.env.FireBase_Key_BASE64;

if (!base64Key) {
  throw new Error('FIREBASE_KEY_BASE64 is not set in environment variables.');
}

const serviceAccount = JSON.parse(
  Buffer.from(base64Key, 'base64').toString('utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'digisky-25d9e.firebasestorage.app', // Replace with your actual bucket
});

const bucket = admin.storage().bucket();

export default bucket;

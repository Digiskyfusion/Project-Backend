import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

const serviceAccountPath = path.resolve('./src/config/firebaseKey.json'); 
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'digisky-25d9e.firebasestorage.app', // Replace with your actual bucket
});

const bucket = admin.storage().bucket();

export default bucket;

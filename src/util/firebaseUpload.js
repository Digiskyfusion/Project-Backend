import bucket from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

const uploadToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    const token = uuidv4();  // ✅ Generate a unique token
    const blob = bucket.file(`${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token,  // ✅ Attach token to metadata
        },
      },
    });

    blobStream.on('error', (err) => reject(err));

    blobStream.on('finish', () => {
      // ✅ Correct URL with the token query param
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${token}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

export default uploadToFirebase;

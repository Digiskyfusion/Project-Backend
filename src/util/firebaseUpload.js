import bucket from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

const uploadToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(`${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.on('error', (err) => reject(err));

    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/digisky-25d9e.firebasestorage.app/o/${encodeURIComponent(blob.name)}?alt=media`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

export default uploadToFirebase;

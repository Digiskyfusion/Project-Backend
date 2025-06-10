import express from "express";
import multer from "multer";
import upload from '../util/multer.js';
import {
  getOrCreateConversation,
  sendMessage,
  getUserConversations,
  markMessagesAsRead,
  uploadFileMessage
} from "../controller/chat.js";

const router = express.Router();

router.route("/conversation/:userId1/:userId2").get(getOrCreateConversation);

router.route("/message").post(sendMessage);

router.route("/user-conversations/:userId").get(getUserConversations);

router.route("/mark-as-read").patch(markMessagesAsRead);

// router.route("/file").post(uploadFileMessage);

router.post('/file', upload.single('file'), uploadFileMessage);

export default router;
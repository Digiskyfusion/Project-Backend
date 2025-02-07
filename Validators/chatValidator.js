// /validators/chatValidator.js
const { check } = require('express-validator');

const validateChatMessage = [
    check('receiver', 'Receiver ID is required').notEmpty(),
    check('message', 'Message cannot be empty').notEmpty(),
];

module.exports ={validateChatMessage}

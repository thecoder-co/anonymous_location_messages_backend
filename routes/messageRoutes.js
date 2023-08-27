const express = require('express');
const messagesController = require('../controllers/messageController');

const router = express.Router();

router
  .route('/')
  .get(messagesController.getAllMessage)
  .post(messagesController.sendMessage);

router
  .route('/messages-within/:distance/center/:latlng')
  .get(messagesController.getMessagesWithin);
// /messages-within?distance=233&center=-40,45
// /messages-within/233/center/-40,45

router.route('/:id').get(messagesController.getMessage);

module.exports = router;

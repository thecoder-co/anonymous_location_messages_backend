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

router
  .route('/messages-bounds/southwest/:southwest/northeast/:northeast')
  .get(messagesController.getMessagesBounds);
// /messages-bounds/southwest/6.092458466156587,2.626495790625012/notheast/6.804776094833544,4.274445009375012

router.route('/messages-bounds').get(messagesController.getMessagesBoundsQuery);

router.route('/:id').get(messagesController.getMessage);

module.exports = router;

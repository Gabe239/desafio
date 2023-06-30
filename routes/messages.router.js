import express from 'express';
import {getMessages, addMessage} from '../dao/managers/messageManagerDb.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

router.post('/', async (req, res) => {
  const { user, message } = req.body;
  try {
    const newMessage = await addMessage(user, message);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
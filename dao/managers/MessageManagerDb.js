import messageModel from '../models/messageModel.js';
async function getMessages() {
  try {
    const messages = await messageModel.find();
    return messages;
  } catch (error) {
    console.error('Error retrieving messages:', error);
    throw error;
  }
}

async function addMessage(user, message) {
  try {
    const newMessage = new messageModel({
      user,
      message,
    });
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}
export { getMessages, addMessage };
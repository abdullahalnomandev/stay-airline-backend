import QueryBuilder from '../../builder/QueryBuilder';
import { Conversation } from '../conversation/conversation.model';
import { Message } from '../message/message.model';
import { User } from '../user/user.model';
import { IMessage } from './message.interface';
const createMessage = async (message: IMessage) => {
  // Create the message first
  const newMessage = await Message.create(message);

  // Update conversation with the new message ID
  await Conversation.updateOne(
    {
      $or: [
        { creator: message.sender, participant: message.receiver },
        { creator: message.receiver, participant: message.sender },
      ],
    },
    {
      lastMessage: newMessage._id,
    }
  );

  return newMessage;
};

const getAllMessages = async (userId: string, participantId: string) => {
  const messages = await Message.find({
    $or: [
      {
        sender: userId,
        receiver: participantId,
      },
      {
        sender: participantId,
        receiver: userId,
      },
    ],
  }).sort({ createdAt: 1 });

  return messages;
};
export const MesdsageService = {
  createMessage,
  getAllMessages,
};

import QueryBuilder from '../../builder/QueryBuilder';
import { Conversation } from '../conversation/conversation.model';
import { Message } from '../message/message.model';
import { IMessage } from './message.interface';
const sendMessage = async (message: IMessage) => {
  // Create the message first
  const newMessage = await Message.create(message);

  // Populate sender information
  await newMessage.populate('sender', 'name _id');

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
      updatedAt: new Date()
    }
  );


  (global as any).io.emit(`new_message::${message.conversation}`, newMessage)

  return newMessage;
};

const getAllMessages = async (query: Record<string, any>, userId: string, conversationId: string) => {

  const isSender = await Message.exists({ sender: userId });
  const populateField = isSender ? 'receiver' : 'sender';

  const result = new QueryBuilder(Message.find({
    conversation: conversationId
  }), query).paginate();

  const data = await result.modelQuery
    .populate({
      path: populateField,
      select: 'name _id',
      model: 'User'
    })

  const pagination = await result.getPaginationInfo();

  return {
    pagination,
    data
  };
};
export const MesdsageService = {
  sendMessage,
  getAllMessages,
};

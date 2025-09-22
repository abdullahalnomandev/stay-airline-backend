import { Socket } from 'socket.io';
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
  await Conversation.findByIdAndUpdate(message.conversation,
    {
      lastMessage: newMessage._id,
      updatedAt: new Date()
    }
  );
  const io =(global as any).io

  io.emit(`new_message::${newMessage.conversation}`, newMessage)
  io.emit(`new_user::${newMessage.receiver}`, newMessage)

  return newMessage;
};

const getAllMessages = async (query: Record<string, any>, userId: string, conversationId: string) => {

  const isSender = await Message.exists({ sender: userId });
  const populateField = isSender ? 'receiver' : 'sender';

  const result = new QueryBuilder(Message.find({
    conversation: conversationId
  }), query).paginate()

  const data = await result.modelQuery
    .populate({
      path: populateField,
      select: 'name _id',
      model: 'User'
    }).sort({createdAt:-1})

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

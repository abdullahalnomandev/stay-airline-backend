import QueryBuilder from '../../builder/QueryBuilder';
import { Message } from '../message/message.model';
import { User } from '../user/user.model';
import { IConversation } from './conversaion.interface';
import { Conversation } from './conversation.model';

const createConversation = async ({
  creator,
  participant,
  text,
}: {
  creator: string;
  participant: string;
  text: string;
}) => {
  const isCreateorExist = await User.findById(creator, '_id').lean().exec();
  const isParticipantExist = await User.findById(participant, '_id')
    .lean()
    .exec();
  if (!isCreateorExist) {
    throw new Error('Creator not found');
  }
  if (!isParticipantExist) {
    throw new Error('Participant not found');
  }

  // 1️⃣ Check for existing conversation
  let conversation = await Conversation.findOne({
    $or: [
      { creator, participant },
      { creator: participant, participant: creator },
    ],
  });

  // 2️⃣ If no conversation, create it
  if (!conversation) {
    conversation = await Conversation.create({ creator, participant });
  }

  // 3️⃣ Create the message
  const newMessage = await Message.create({
    conversation: conversation._id,
    sender: creator,
    receiver: participant,
    text: text,
  });

  // 4️⃣ Update lastMessage in conversation
  conversation.lastMessage = newMessage._id;
  await conversation.save();

  // 5️⃣ Populate lastMessage
  await conversation.populate({
    path: 'lastMessage',
    populate: {
      path: 'sender receiver',
      model: 'User',
      select: '_id name',
    },
  });
  return conversation;
};
const getAllConversaions = async (query: Record<string, any>, userId: string) => {

  const isParticipant = await Conversation.exists({ creator: userId });
  const populateField = isParticipant ? 'participant' : 'creator';

  const result = new QueryBuilder(Conversation.find({
    $or: [{ creator: userId }, { participant: userId }],
  }), query).paginate().sort();

  const data = await result.modelQuery.populate({
    path: populateField,
    select: 'name _id',
    model: 'User',
  })
    .populate({
      path: 'lastMessage',
      select: 'text -_id',
    });

  const pagination = await result.getPaginationInfo();

  return {
    pagination,
    data
  };
};

export const ConversationService = {
  createConversation,
  getAllConversaions,
};

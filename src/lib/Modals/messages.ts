import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderid: {
        type: String,
    },
    receiverid: {
        type: String,
        default: 'All',
    },
    sendername: {
        type: String,
    },
    receivername: {
        type: String,
        default: 'All',
    },  
    message: {
        type: String,
        required: true,
    },
    chatroomid: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
})

const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default MessageModel;
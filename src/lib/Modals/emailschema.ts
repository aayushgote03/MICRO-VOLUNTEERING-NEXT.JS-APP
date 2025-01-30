import mongoose from "mongoose";

const emailschema = new mongoose.Schema(
    {
        sender: String, 
        reciever: String,
        body: String, 
        subject: String, 
        received_time: String
    },
);

const emailModel = mongoose.models.emails || mongoose.model('emails', emailschema);

export default emailModel;

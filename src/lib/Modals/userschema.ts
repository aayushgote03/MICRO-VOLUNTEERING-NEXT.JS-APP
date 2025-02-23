import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';
import { StringDecoder } from 'string_decoder';

const tasks_applied = new mongoose.Schema(
    {
       task_id: {type: String}, 
       status: {type: String, status: 'pending'}
    }
);

const application_form = new mongoose.Schema(
    {
        applicant_id: {type: String},
        applied_task_id: {type: String},
        email_link: {type: String},
        status: {type: String, default: 'pending'}
    }
);


const UserSchema = new mongoose.Schema(
    {
        handlename: {type: String, unique: true},
        username: String,
        email: {type: String, unique: true},
        password: String,
        tasks_applied: {type: [tasks_applied], default: []},
        application: {type: [application_form], default: []}
    },
);

const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);

export default UserModel;

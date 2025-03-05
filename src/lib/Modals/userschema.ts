import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        handlename: {type: String, unique: true},
        username: String,
        email: {type: String, unique: true},
        password: String,
        tasks_applied: {type: [String], default: []},
        application: {type: [String], default: []}
    },
);

// Add runtime check
const UserModel = mongoose.models.users || mongoose.model('users', UserSchema)


export default UserModel;

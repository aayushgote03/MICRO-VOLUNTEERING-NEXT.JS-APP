import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    {
        user: String, 
        taskName: String,
        description: String, 
        category: String, 
        deadline: String,
        status: String,
        inactiveMessage: String,
        createdAt: {type: String, required: true},
        imageurl: {type: String},
        oftype: {type: String},
        applied_user: {type: [String], default: [],},
        capacity: {type: Number, default: 5},
        applied: {type: Number, default: 0},
        enrolled: {type: Number, default: 0},
        messages: {type: [String], default: []},
        users_to_notify: {type: [String], default: []},
    },
);

const TaskModel = mongoose.models.tasks || mongoose.model('tasks', TaskSchema);

export default TaskModel;

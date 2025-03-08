import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    task_id: {
        type: String,
    },
    user_email: {
        type: String,
    },
    application_id: {
        type: String,
        default: null
    },
    acknowledged: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: Date.now
    }
    
});

const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default NotificationModel;

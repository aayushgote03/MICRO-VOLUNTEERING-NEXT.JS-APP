import connectToDatabase from "@/lib/db";
import UserModel from "@/lib/Modals/userschema";
import NotificationModel from "@/lib/Modals/notificationschema";
import { NextRequest, NextResponse } from "next/server";
import TaskModel from "@/lib/Modals/taskschema";

export const POST = async (request: NextRequest) => {
    const { user_email } = await request.json();
    console.log(user_email, 'user_email');
    let notifications: any[] = [];

    try {
        connectToDatabase();
        const user = await UserModel.findOne({ email: user_email });
        if(user){
            console.log(user, 'user');
            const notification_ids = user.notifications_ids;
            console.log(notification_ids, 'notification_ids');

           for(const notification_id of notification_ids){
                const notification = await NotificationModel.findById(notification_id);
                console.log(notification, 'notification');
                if(notification){
                    const task = await TaskModel.findById(notification.task_id);
                    const status = task.status;

                    if(status === 'Active'){

                    
                    const task_name = task.taskName;
                    const notification_data = {
                        task_id: task._id,
                        id: notification._id,
                        task_name: task_name,
                        status: status,
                        acknowledged: notification.acknowledged
                    }
                    
                    notifications.push(notification_data);
                }
            }
            }
        }
        return NextResponse.json(notifications, { status: 200 });
    }
    catch(error){
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export const DELETE = async (request: NextRequest) => {
    const { notification_id, user_email, task_id } = await request.json();

    try {
        connectToDatabase();
        // Delete the notification document
        await NotificationModel.findByIdAndDelete(notification_id);
        
        // Update user document by pulling the notification_id from notifications_ids array
        await UserModel.findOneAndUpdate(
            { email: user_email },
            { $pull: { notifications_ids: notification_id } }
        );

        await TaskModel.findByIdAndUpdate(task_id, { $pull: { users_to_notify: user_email } });

        return NextResponse.json({ message: 'Notification acknowledged' }, { status: 200 });
    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
    }
}


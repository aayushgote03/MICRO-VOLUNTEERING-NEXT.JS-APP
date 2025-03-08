import connectToDatabase from "@/lib/db";
import UserModel from "@/lib/Modals/userschema";
import NotificationModel from "@/lib/Modals/notificationschema";
import { NextRequest, NextResponse } from "next/server";
import TaskModel from "@/lib/Modals/taskschema";
import ApplicationModel from "@/lib/Modals/applicationschema";

export const POST = async (request: NextRequest) => {
  const { user_email } = await request.json();
  console.log(user_email, "user_email");
  let reminder_notifications: any[] = [];
  let application_notifications: any[] = [];

  try {
    connectToDatabase();
    const user = await UserModel.findOne({ email: user_email });
    if (user) {
      console.log(user, "user");
      const notification_ids = user.notifications_ids;
      console.log(notification_ids, "notification_ids");

      for (const notification_id of notification_ids) {
        const notification = await NotificationModel.findById(notification_id);
        console.log(notification, "notification");
        if (notification) {
          const task = await TaskModel.findById(notification.task_id);
          const status = task.status;

          if (notification.type === "reminder" && task.status === "Active") {
            const task_name = task.taskName;
            const reminder_notification_data = {
              type: notification.type,
              task_id: task._id,
              id: notification._id,
              task_name: task_name,
              status: status,
              acknowledged: notification.acknowledged,
            };

            reminder_notifications.push(reminder_notification_data);
          } else if (notification.type === "application") {
            const application = await ApplicationModel.findById(
              notification.application_id
            );
            const status = application.status;

            if (status === "approved") {
                const task_name = task.taskName;
                const application_notification_data = {
                    type: notification.type,
                    task_id: task._id,
                    id: notification._id,
                    task_name: task_name,
                    status: status,
                    acknowledged: notification.acknowledged,
                }
                application_notifications.push(application_notification_data);
            }
          }
          console.log(reminder_notifications, "reminder_notifications");
          console.log(application_notifications, "application_notifications");
        }
      }
    }
    return NextResponse.json(
        {reminder_notifications: reminder_notifications, application_notifications: application_notifications},
        { status: 200 }
      );
    
  }
  
  
  catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

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

    await TaskModel.findByIdAndUpdate(task_id, {
      $pull: { users_to_notify: user_email },
    });

    return NextResponse.json(
      { message: "Notification acknowledged" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
};

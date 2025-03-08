import { NextRequest, NextResponse } from "next/server";
import NotificationModel from "@/lib/Modals/notificationschema";
import TaskModel from "@/lib/Modals/taskschema";        
import UserModel from "@/lib/Modals/userschema";
import getTime from "@/lib/actions/gettime";
export async function POST(request: NextRequest) {
    const { task_id, user_email } = await request.json();
    console.log(task_id, user_email);
    try {
        const task = await TaskModel.findById(task_id);
        const user_to_notify = task?.users_to_notify;
        if(user_to_notify.includes(user_email)) {
            console.log("reminder already set");
            return NextResponse.json({ message: "reminder already set" }, { status: 400 });
        }
        const notification = await NotificationModel.create({ task_id, user_email, createdAt: getTime() });
        return NextResponse.json({ message: "Notification created", notification });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error creating notification", error }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const { task_id, user_email, notification_id } = await request.json();
    console.log(task_id, user_email);
    try {
            const task = await TaskModel.findByIdAndUpdate(task_id, { $push: { users_to_notify: user_email } });
        
        if(notification_id) {
            const user = await UserModel.findOneAndUpdate({ email: user_email }, { $push: { notifications_ids: notification_id } });
        }
        return NextResponse.json({ message: "Notification created", task });
    } catch (error) {
        return NextResponse.json({ message: "Error creating notification", error }, { status: 500 });
    }
}

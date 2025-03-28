import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import UserModel from "@/lib/Modals/userschema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const task_id = payload.task_id;
    const user = payload.user_email;

    try {
        connectToDatabase();
        const found_Task = await TaskModel.findById(task_id);
        const found_user = await UserModel.findOne({email: user});
        const found_user_id = found_user._id;

        const applied_user_ids = found_Task.applied_user;
        console.log(applied_user_ids);

        if(applied_user_ids.includes(found_user_id)) {
            if(found_Task.users_to_notify.includes(user)) {
                return NextResponse.json({message: "already applied", reminder: true})
            }
            else {
            return NextResponse.json({message: "already applied", reminder: false})
            }
        }

        if(found_Task.users_to_notify.includes(user)) {
            return NextResponse.json({message: "reminder already set", reminder: true});
        }

        return NextResponse.json({message: "not applied yet", reminder: false})

    } catch (error) {

        console.log(error);
        return NextResponse.json({message: "failure"})
        
    }
}
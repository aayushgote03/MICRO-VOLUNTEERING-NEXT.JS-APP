import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import UserModel from "@/lib/Modals/userschema";
export async function PUT(request: NextRequest, { params }) {
  
  let taskid = await params;
  taskid = taskid.taskid;
  const payload = await request.json();

  console.log(payload);

  try {
    connectToDatabase();
    const user = await UserModel.findOne({ email: payload.applicant });
    const task = await TaskModel.findById(taskid);

    let author = task.user;
    author = await UserModel.findOne({email: author}); //will get the author of the task

   const isUserAlreadyApplied = task.applied_user.includes(user._id);

    if (isUserAlreadyApplied) {
        return NextResponse.json({ success: false, message: "User has already applied" });
    }

    const updatedtask = await TaskModel.findByIdAndUpdate(taskid, {
      $push: { applied_user: user._id },
    });

    const updated_user = await UserModel.findByIdAndUpdate(author._id, {
      $push: { 'application': {applicant_id: user._id,
      applied_task_id: task._id, email_link: payload.email_id}
    }});

  


    await UserModel.findByIdAndUpdate( user._id ,{
      $push: { tasks_applied: {task_id: task._id, status: 'pending'}
    }});

    return NextResponse.json({ success: true, message: "application added"});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "updation failed" });
  }
}
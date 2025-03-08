import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import UserModel from "@/lib/Modals/userschema";
import ApplicationModel from "@/lib/Modals/applicationschema";
import NotificationModel from "@/lib/Modals/notificationschema";
import getTime from "@/lib/actions/gettime";


export async function PUT(request: NextRequest) {
  
  const payload = await request.json();
  const taskid = payload.taskid;

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

  

    await UserModel.findByIdAndUpdate(author._id, {
      $push: { application: payload.application_id }}); //add the application id to the author's application array

    await UserModel.findByIdAndUpdate( user._id ,{
      $push: { tasks_applied: payload.application_id  //add the application id to the user's tasks_applied array
    }});

    return NextResponse.json({ success: true, message: "application added"});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "updation failed" });
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { taskid, applicationid } = payload;
  console.log(taskid, applicationid);

  try {
    connectToDatabase();
    const task = await TaskModel.findById(taskid);
    const task_id = task._id;
    const application = await ApplicationModel.findById(applicationid);
    const applicant_id = application.applicant_id;

    const notification = await NotificationModel.create({
      task_id: task_id,
      user_email: applicant_id,
      application_id: applicationid,
      createdAt: getTime(),
    });

    const saved_notification = await notification.save();
   
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "unable to produce notification" });
  }
  return NextResponse.json({ success: true, message: "application added" });
}

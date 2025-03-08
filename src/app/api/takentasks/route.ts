import connectToDatabase from "@/lib/db";
import ApplicationModel from "@/lib/Modals/applicationschema";
import TaskModel from "@/lib/Modals/taskschema";
import UserModel from "@/lib/Modals/userschema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    connectToDatabase();

    const user = await UserModel.findOne({ email: email });

    let tasks: Array<any> = [];

    async function processapplication(application: any) {
      const task = await TaskModel.findById(application.applied_task_id);
      const taskauthor = await UserModel.findOne({ email: task.user });
      const taskdata = {
        chatroom_id: task._id,
        taskname: task.taskName,
        description: task.description,
        status: task.status,
        deadline: task.deadline,
        author: taskauthor.handlename,
        applied_users: task.applied_user,
      };
      tasks.push(taskdata);
    }
    for (const application_id of user.tasks_applied) {
      const application = await ApplicationModel.findById(application_id);
      if (application.status === "approved") {
        await processapplication(application);
      }
    }

    console.log(tasks.length, "tasks");
    return NextResponse.json({ success: true, taskestaken: tasks });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

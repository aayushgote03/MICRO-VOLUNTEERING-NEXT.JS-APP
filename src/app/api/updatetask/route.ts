import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import { NextRequest, NextResponse } from "next/server";


// CORS Headers (adjust the allowed origin as needed)



export async function PUT(request: NextRequest) {

  const payload = await request.json();
  const taskid = payload.taskid;
  const taskdata = payload.taskdata;
  console.log(request.method);

  



  try {
    // Connect to database and update task
    await connectToDatabase();
    const task = await TaskModel.findByIdAndUpdate(taskid, taskdata);
    console.log(task);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Updation failed" });
  }

  return NextResponse.json(
    { success: true, message: "Update successful" },
  );
}

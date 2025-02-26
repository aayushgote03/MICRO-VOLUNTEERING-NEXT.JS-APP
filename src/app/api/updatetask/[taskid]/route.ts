import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  taskid: string;
}

// CORS Headers (adjust the allowed origin as needed)

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const { taskid } = params;
  const payload = await request.json();
  console.log(request.method);



  try {
    // Connect to database and update task
    await connectToDatabase();
    const task = await TaskModel.findByIdAndUpdate(taskid, payload);
    console.log(task);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Updation failed" });
  }

  return NextResponse.json(
    { success: true, message: "Update successful" },
  );
}

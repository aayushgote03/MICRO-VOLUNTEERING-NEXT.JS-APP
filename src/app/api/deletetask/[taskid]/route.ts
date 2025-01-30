import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  let taskid = await params;
  taskid = taskid.taskid;

  try {
    connectToDatabase();

    const task = await TaskModel.findByIdAndDelete(taskid); // Find task by ID using Mongoose

    if (!task) {
      return NextResponse.json({ message: "not found" });
    }

    return NextResponse.json({ success: true, message: "task deleted" });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "task deletion failed",
    });
  }
}

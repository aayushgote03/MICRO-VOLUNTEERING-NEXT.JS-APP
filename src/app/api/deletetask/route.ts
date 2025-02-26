import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  request: NextRequest
) {
  const { taskid } = await request.json();

  try {
  
    await connectToDatabase();

    if (!taskid || typeof taskid !== 'string') {
      return NextResponse.json(
        { success: false, message: "Invalid task ID" },
        { status: 400 }
      );
    }

    const task = await TaskModel.findByIdAndDelete(taskid);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { success: false, message: "Failed to delete task" },
      { status: 500 }
    );
  }
}

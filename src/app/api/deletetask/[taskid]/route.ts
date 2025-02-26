import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  taskid: string;
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { taskid } = params;

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

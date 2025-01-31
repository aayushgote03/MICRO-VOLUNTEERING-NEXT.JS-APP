import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    let payload = await request.json();
    const {user, taskName, description, category, deadline, status, inactiveMessage, imageurl, oftype} = payload;
    const utcDate = new Date();
    let createdAt = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
    createdAt = createdAt.toISOString();
    const newtask = {
        user, 
        taskName,
        description, 
        category,
        deadline,
        status,
        inactiveMessage,
        createdAt,
        imageurl,
        oftype
    }
    connectToDatabase();
    let task = new TaskModel(newtask);
    const result = await task.save();
    return NextResponse.json({result, success: true, status: 200});     
}




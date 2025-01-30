import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import TaskModel from "@/lib/Modals/taskschema";

export async function GET() {
    let data = [];
    try {
        connectToDatabase();
        data = await TaskModel.find();
        console.log(data);
        
    } catch (error) {
        console.log(error);
    }

    return NextResponse.json(data, {status: 200});
}
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserModel from "@/lib/Modals/userschema";

export async function GET() {
    let data = [];
    try {
        connectToDatabase();
        data = await UserModel.find();
        console.log(data);
    } catch (error) {
        console.log(error);
    }

    return NextResponse.json(data, {status: 200});
}
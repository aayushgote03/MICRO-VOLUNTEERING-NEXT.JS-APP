import connectToDatabase from "@/lib/db";
import UserModel from "@/lib/Modals/userschema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request) {
    let payload = await request.json();
    const {handlename, username, email, password} = payload;
    const hashedpassword =  await bcrypt.hash(password, 5);
    const newuser = {
        handlename,
        username,
        email,
        password : hashedpassword
    }
    connectToDatabase();
    let user = new UserModel(newuser);
    const result = await user.save();
    return NextResponse.json({result, success: true, status: 200});     
}




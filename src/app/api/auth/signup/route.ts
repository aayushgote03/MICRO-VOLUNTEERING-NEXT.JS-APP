import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserModel from "@/lib/Modals/userschema";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        let payload = await request.json();
        const { handlename, username, email, password } = payload;

        if (!handlename || !username || !email || !password) {
            return NextResponse.json({ error: "All fields are required", success: false, status: 400 });
        }

        const hashedpassword = await bcrypt.hash(password, 5);
        const newuser = {
            handlename,
            username,
            email,
            password: hashedpassword
        };

        await connectToDatabase();
        let user = new UserModel(newuser);
        const result = await user.save();

        return NextResponse.json({ result, success: true, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false, status: 500 });
    }
}

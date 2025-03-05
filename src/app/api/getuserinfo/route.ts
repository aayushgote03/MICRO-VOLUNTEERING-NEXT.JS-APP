import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/Modals/userschema";
import connectToDatabase from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const ids = data.id;
        let particapants = [];
        connectToDatabase();

        for (const id of ids) {
            const user = await UserModel.findById(id);
            particapants.push(user);
        }
        return NextResponse.json({ success: true, particapants });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to get user info" }, { status: 500 });
    }
}
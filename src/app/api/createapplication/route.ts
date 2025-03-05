import connectToDatabase from "@/lib/db";
import ApplicationModel from "@/lib/Modals/applicationschema";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const payload = await request.json();
    const { applicant_id, applied_task_id, email_link, status } = payload;

    await connectToDatabase();
    const newapplication = new ApplicationModel({ applicant_id, applied_task_id, email_link, status });
    await newapplication.save();

    return NextResponse.json({ success: true, message: "application created", newapplication });
}


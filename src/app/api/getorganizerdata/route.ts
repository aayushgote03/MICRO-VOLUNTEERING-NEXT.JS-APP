import connectToDatabase from "@/lib/db";
import emailModel from "@/lib/Modals/emailschema";
import TaskModel from "@/lib/Modals/taskschema";
import UserModel from "@/lib/Modals/userschema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        console.log(payload);
        const email = payload.organizer_email;
        let appplicants_data = [];

        async function processdata(app) {
            connectToDatabase();
            const applicant = await UserModel.findById(app.applicant_id);
            const applicant_name = applicant.username;
            const task = await TaskModel.findById(app.applied_task_id);
            const taskname = task.taskName;
            const email = await emailModel.findById(app.email_link);
            appplicants_data.push({
                applicant_name: applicant_name,
                taskname: taskname,
                status: app.status,
                category : task.category,
                email: email
            })
        };
        try {
            connectToDatabase();
            const organizer = await UserModel.findOne({email: email});
            const applications = organizer.application.recieved;
            
            for (const app of applications) {
                await processdata(app);
            }

            return NextResponse.json({appplicants_data, success: true});
            
        } catch (error) {
            return NextResponse.json({success: false, message: error});
            
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({succes: false, message: error}) 
    }
}
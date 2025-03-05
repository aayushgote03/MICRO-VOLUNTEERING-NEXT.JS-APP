import connectToDatabase from "@/lib/db";
import ApplicationModel from "@/lib/Modals/applicationschema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT (req: NextRequest) {

    const {action, organizeremail, app_id} = await req.json();

    try {
        connectToDatabase();

    if (action === 'approve') {
        await ApplicationModel.findByIdAndUpdate(app_id, {status: 'approved'});
    } else if (action === 'reject') {
        await ApplicationModel.findByIdAndUpdate(app_id, {status: 'rejected'});
    }

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: 'failed'})
        
    }
    
    return NextResponse.json({succee: true, message: action});
    

}
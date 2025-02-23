import connectToDatabase from "@/lib/db";
import UserModel from "@/lib/Modals/userschema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT (req: NextRequest) {

    const {action, organizeremail, app_id} = await req.json();

    try {
        connectToDatabase();

    const data = await UserModel.updateMany({
        email: organizeremail,
        "application._id": app_id
    },
    {
        "$set": {
            "application.$.status" : action
        }
    } 
    )
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: 'failed'})
        
    }
    
    return NextResponse.json({succee: true, message: action});
    

}
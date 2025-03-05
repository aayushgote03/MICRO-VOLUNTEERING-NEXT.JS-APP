import mongoose from "mongoose";

const application_form = new mongoose.Schema(
    {
        applicant_id: {type: String},
        applied_task_id: {type: String},
        email_link: {type: String},
        status: {type: String, default: 'pending'}
    }
);

const ApplicationModel = mongoose.models.applications || mongoose.model("applications", application_form);

export default ApplicationModel;

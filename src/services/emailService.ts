import * as nodemailer from "nodemailer";
import emailConfig from "../config/emailConfig";
import { Task } from "./azureService";

export async function sendEmail(tasks: Task[]) {
    const transporter = nodemailer.createTransport({
        host: emailConfig.smtpHost,
        port: emailConfig.smtpPort,
        secure: false,
        auth: {
            user: emailConfig.smtpUser,
            pass: emailConfig.smtpPass,
        },
        tls: {
            rejectUnauthorized: false,
          },
    });

    const taskList = tasks
        .map(task => `🔹 ${task.title} - *${task.state}*\n🔗 [Task Link](${task.url})`)
        .join("\n\n");

    const mailOptions = {
        from: emailConfig.emailFrom,
        to: emailConfig.emailTo,
        subject: "📌 Weekly Azure DevOps Task Update",
        text: `Here is your weekly task progress:\n\n${taskList}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

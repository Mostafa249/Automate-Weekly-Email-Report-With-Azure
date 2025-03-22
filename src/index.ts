import "./config/dotenvConfig";
import { fetchAzureDevOpsTasks } from "./services/azureService";
import { sendEmail } from "./services/emailService";

async function main() {
  console.log("📢 Fetching Azure DevOps tasks...");
  const tasks = await fetchAzureDevOpsTasks();

  if (tasks.length === 0) {
    console.log("✅ No tasks found for this user.");
    return;
  }

  console.log("📢 Sending email with task updates...");
  await sendEmail(tasks);
}

main();

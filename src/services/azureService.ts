import axios from "axios";
import azureConfig from "../config/azureConfig";

export interface Task {
    id: number;
    title: string;
    state: string;
    url: string;
}

export async function fetchAzureDevOpsTasks(): Promise<Task[]> {
    try {
        const url = `${azureConfig.orgUrl}/${azureConfig.projectName}/_apis/wit/wiql?api-version=6.0`;

        const query = {
            query: `SELECT [System.Id], [System.Title], [System.State]
              FROM WorkItems
              WHERE [System.AssignedTo] CONTAINS '${azureConfig.userEmail}'`
        };

        const response = await axios.post(url, query, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(":" + azureConfig.personalAccessToken).toString("base64")}`,
            },
        });

        const workItems = response.data.workItems;
        if (!workItems) return [];

        const taskPromises = workItems.map(async (item: any) => {
            const detailsUrl = `${azureConfig.orgUrl}/_apis/wit/workitems/${item.id}?api-version=6.0`;
            const detailsResponse = await axios.get(detailsUrl, {
                headers: {
                    Authorization: `Basic ${Buffer.from(":" + azureConfig.personalAccessToken).toString("base64")}`,
                },
            });

            return {
                id: detailsResponse.data.id,
                title: detailsResponse.data.fields["System.Title"],
                state: detailsResponse.data.fields["System.State"],
                url: `${azureConfig.orgUrl}/${azureConfig.projectName}/_workitems/edit/${detailsResponse.data.id}`
            };
        });
        console.log(await Promise.all(taskPromises));
        return await Promise.all(taskPromises);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

// update-data.js

const fetch = require("node-fetch");

async function updateData() {
  try {
    // 1. Fetch existing data from data.json
    const response = await fetch(
      "https://api.github.com/repos/rubentanner/rubentanner.github.io/contents/data.json",
      {
        headers: {
          Authorization: `token ${process.env.TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} ${response.statusText}`
      );
    }

    const fileData = await response.json();
    const existingData = JSON.parse(atob(fileData.content));

    // 2. Read data from localStorage (if available) - This will be empty, but we'll keep the code for clarity
    const localStorageData =
      JSON.parse(localStorage.getItem("weeklyData")) || [];

    // 3. Combine existing data with new data
    const updatedData = [...existingData, ...localStorageData];

    // 4. Update data.json with the combined data
    const updatedContent = btoa(JSON.stringify(updatedData, null, 2));

    const updateResponse = await fetch(
      "https://api.github.com/repos/rubentanner/rubentanner.github.io/contents/data.json",
      {
        method: "PUT",
        headers: {
          Authorization: `token ${process.env.TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update strength data",
          content: updatedContent,
          sha: fileData.sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(
        `Error updating data: ${updateResponse.status} ${updateResponse.statusText}`
      );
    }

    console.log("Data successfully updated!");

    // 5. Clear localStorage - Again, this will be empty in this context
    localStorage.removeItem("weeklyData");
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

updateData();

const form = document.getElementById("strength-form");
const resultsDiv = document.getElementById("results");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  const name = document.getElementById("name").value;
  const bench = document.getElementById("bench").value;
  const squat = document.getElementById("squat").value;
  // ... get values for other exercises

  // Basic data validation (you can add more)
  if (!name || !bench || !squat) {
    alert("Please fill in all fields.");
    return;
  }

  const [year, week] = getWeekNumber(new Date());
  const submissionKey = `${name}_${year}_week${week}`;

  if (localStorage.getItem(submissionKey)) {
    alert("You have already submitted data this week.");
    return;
  }

  // 1. Get existing data from localStorage or initialize an empty array
  let weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || [];

  // 2. Add the new data
  const newData = {
    name: name,
    bench: bench,
    squat: squat,
    // ... other exercises
    date: new Date().toLocaleDateString(), // Add the current date
  };
  weeklyData.push(newData);

  // 3. Save the updated data back to localStorage
  localStorage.setItem("weeklyData", JSON.stringify(weeklyData));

  localStorage.setItem(submissionKey, true); // Set the flag to prevent duplicate submission

  // Display the results (we'll create a function for this)
  displayResults(weeklyData);

  // Clear the form
  form.reset();
});

function displayResults(data) {
  // Create a table to display the results
  let tableHTML =
    "<table><thead><tr><th>Name</th><th>Bench</th><th>Squat</th><th>Date</th></tr></thead><tbody>";

  data.forEach((entry) => {
    tableHTML += `<tr><td>${entry.name}</td><td>${entry.bench}</td><td>${entry.squat}</td><td>${entry.date}</td></tr>`;
  });

  tableHTML += "</tbody></table>";
  resultsDiv.innerHTML = tableHTML;
}

function exportToJSON(data, filename) {
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(data, null, 2)], {
    type: "text/plain",
  });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

// Schedule weekly export (using a simple timeout for now)
setInterval(() => {
  const weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || [];
  const [year, week] = getWeekNumber(new Date());
  const filename = `strength-data_${year}_week${week}.json`;
  exportToJSON(weeklyData, filename);
  localStorage.removeItem("weeklyData"); // Clear data after export
}, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

// Initial display of results when the page loads
displayResults(JSON.parse(localStorage.getItem("weeklyData")) || []);

const form = document.getElementById("strength-form");
const resultsDiv = document.getElementById("results");
const exportButton = document.getElementById("export-data");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const weight = document.getElementById("weight").value; // Get weight value
  const position = document.getElementById("position").value; // Get position value
  const bench = document.getElementById("bench").value;
  const squat = document.getElementById("squat").value;

  if (!name || !weight || !position || !bench || !squat) {
    alert("Please fill in all fields.");
    return;
  }

  const [year, week] = getWeekNumber(new Date());
  const submissionKey = `${name}_${year}_week${week}`;

  if (localStorage.getItem(submissionKey)) {
    alert("You have already submitted data this week.");
    return;
  }

  let weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || [];

  const newData = {
    name: name,
    weight: weight, // Include weight in the data
    position: position, // Include position in the data
    bench: bench,
    squat: squat,
    date: new Date().toLocaleDateString(),
  };
  weeklyData.push(newData);

  localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
  localStorage.setItem(submissionKey, true);

  displayResults(weeklyData);
  form.reset();
});

function displayResults(data) {
  let tableHTML =
    "<table><thead><tr><th>Name</th><th>Weight</th><th>Position</th><th>Bench</th><th>Squat</th><th>Date</th></tr></thead><tbody>";

  data.forEach((entry) => {
    tableHTML += `<tr>
                        <td>${entry.name}</td>
                        <td>${entry.weight}</td> 
                        <td>${entry.position}</td> 
                        <td>${entry.bench}</td>
                        <td>${entry.squat}</td>
                        <td>${entry.date}</td>
                      </tr>`;
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
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return [d.getUTCFullYear(), weekNo];
}

exportButton.addEventListener("click", () => {
  const weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || [];
  const [year, week] = getWeekNumber(new Date());
  const filename = `strength-data_${year}_week${week}.json`;
  exportToJSON(weeklyData, filename);
});

setInterval(() => {
  const weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || [];
  const [year, week] = getWeekNumber(new Date());
  const filename = `strength-data_${year}_week${week}.json`;
  exportToJSON(weeklyData, filename);
  localStorage.removeItem("weeklyData");
}, 7 * 24 * 60 * 60 * 1000);

displayResults(JSON.parse(localStorage.getItem("weeklyData")) || []);

// ============================================
// GENDER RATIO IN SCHOOLING
// Main JavaScript File
// ============================================

// 1. LOAD EXISTING SCHOOL RECORDS

const defaultSchools = [
    {
        name: "ZPHS Guntur Main",
        total: 320,
        boys: 160,
        girls: 160,
        attendance: "94%",
        transfer: "2%",
        dropout: "1%",
        summary: "ZPHS Guntur Main demonstrates exemplary gender parity with an equal distribution of boys and girls. The institution maintains community engagement initiatives that encourage girls to continue their education. Health and nutritional support programs contribute to daily attendance. Academic infrastructure includes digital classrooms and laboratory facilities. Remedial coaching supports students who need additional academic assistance. Faculty members promote an inclusive learning environment. Overall, the school supports educational equity and rural development."
    },
    {
        name: "M.P.P. School Mangalagiri",
        total: 210,
        boys: 110,
        girls: 100,
        attendance: "91%",
        transfer: "3%",
        dropout: "2%",
        summary: "M.P.P. School Mangalagiri provides foundational primary education. Its enrollment reflects a relatively balanced gender distribution. Parental counselling supports student retention and attendance. Mid-day meal services encourage regular school participation. Scholarship information is shared with eligible families. Basic digital learning tools support classroom education. Teachers encourage holistic development through academic and extracurricular activities."
    }
];

let schoolRecords = [];

try {
    const savedData = JSON.parse(
        localStorage.getItem("cspSchoolRecords")
    );

    schoolRecords = Array.isArray(savedData) && savedData.length > 0
        ? savedData
        : defaultSchools;

} catch (error) {
    schoolRecords = defaultSchools;
}

saveSchoolRecords();

let isDeveloperMode = false;


// 2. SAVE SCHOOL DATA

function saveSchoolRecords() {
    localStorage.setItem(
        "cspSchoolRecords",
        JSON.stringify(schoolRecords)
    );
}


// 3. DEVELOPER MODE

function toggleDevMode() {

    if (!isDeveloperMode) {

        const password = prompt("Enter Developer Password:");

        if (password !== "MySecretPassword123") {
            alert("Incorrect Password! Access Denied.");
            return;
        }

        isDeveloperMode = true;

        alert("Developer Mode Enabled!");

    } else {

        isDeveloperMode = false;

        alert("Developer Mode Disabled!");
    }

    const formSection = document.getElementById(
        "developer-form-section"
    );

    if (formSection) {
        formSection.style.display =
            isDeveloperMode ? "block" : "none";
    }

    const button = document.getElementById("dev-mode-btn");

    if (button) {
        button.textContent = isDeveloperMode
            ? "Exit Developer Mode"
            : "Developer Mode";
    }
}


// 4. DISPLAY SCHOOL NAMES ONLY

function renderDashboardSchools(filter = "") {

    const container = document.getElementById(
        "school-list-container"
    );

    if (!container) return;

    container.innerHTML = "";

    const filteredSchools = schoolRecords.filter(school =>
        school.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredSchools.length === 0) {

        container.textContent = "No schools found.";

        return;
    }

    filteredSchools.forEach(school => {

        const actualIndex = schoolRecords.indexOf(school);

        const card = document.createElement("div");

        card.className = "school-item-card";

        const button = document.createElement("button");

        button.className = "primary-btn";

        button.style.width = "100%";

        button.textContent = "🏫 " + school.name;

        button.onclick = function () {
            openSchoolProfile(actualIndex);
        };

        card.appendChild(button);

        container.appendChild(card);

    });
}


// 5. SCHOOL SEARCH

function filterSchools() {

    const searchInput = document.getElementById(
        "school-search-input"
    );

    if (!searchInput) return;

    renderDashboardSchools(searchInput.value);
}


// 6. OPEN INDIVIDUAL SCHOOL PAGE

function openSchoolProfile(index) {

    if (!schoolRecords[index]) {
        alert("School record not found.");
        return;
    }

    localStorage.setItem("activeSchoolIndex", index);

    window.location.href = "school.html";
}


// 7. ADD NEW SCHOOL MANUALLY

const schoolForm = document.getElementById("school-form");

if (schoolForm) {

    schoolForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!isDeveloperMode) {
            alert("Please enable Developer Mode first.");
            return;
        }

        const name = document.getElementById(
            "school-name"
        ).value.trim();

        const total = Number(document.getElementById(
            "total-students"
        ).value);

        const boys = Number(document.getElementById(
            "boys-count"
        ).value);

        const girls = Number(document.getElementById(
            "girls-count"
        ).value);

        if (!name || total < 1 || boys < 0 || girls < 0) {
            alert("Please enter valid school information.");
            return;
        }

        if (boys + girls !== total) {
            alert("Total students must equal boys + girls.");
            return;
        }

        const duplicate = schoolRecords.some(
            school => school.name.toLowerCase() === name.toLowerCase()
        );

        if (duplicate) {
            alert("This school is already registered.");
            return;
        }

        const newSchool = {
            name: name,
            total: total,
            boys: boys,
            girls: girls,

            attendance: "Not provided",
            transfer: "Not provided",
            dropout: "Not provided",

            transfers: 0,
            dropouts: 0,

            summary:
                name + " is included in the Gender Ratio in Schooling study. " +
                "The school provides educational services to students in its area. " +
                "Student enrollment is recorded separately for boys and girls. " +
                "Attendance information can be added for further analysis. " +
                "Transfer records can help understand student movement. " +
                "Dropout records can help identify students who leave education. " +
                "The collected information supports educational planning and gender equality."
        };

        schoolRecords.push(newSchool);

        saveSchoolRecords();

        alert("School added successfully!");

        schoolForm.reset();

        renderDashboardSchools();

    });

}


// 8. IMPORT EXCEL OR CSV FILE

function importExcelFile() {

    if (!isDeveloperMode) {
        alert("Developer Mode is required.");
        return;
    }

    const fileInput = document.getElementById("excel-file");

    if (!fileInput || !fileInput.files.length) {
        alert("Please select an Excel or CSV file.");
        return;
    }

    if (typeof XLSX === "undefined") {
        alert("Excel library is not loaded. Check your internet connection.");
        return;
    }

    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (event) {

        try {

            const workbook = XLSX.read(
                event.target.result,
                { type: "array" }
            );

            const sheet = workbook.Sheets[
                workbook.SheetNames[0]
            ];

            const rows = XLSX.utils.sheet_to_json(sheet);

            if (rows.length === 0) {
                alert("The selected file has no records.");
                return;
            }

            let added = 0;
            let skipped = 0;

            rows.forEach(row => {

                const values = {};

                Object.keys(row).forEach(key => {
                    values[key.trim().toLowerCase().replace(/[\s_-]+/g, "")] = row[key];
                });

                const name = String(
                    values.schoolname || values.school || values.name || ""
                ).trim();

                const total = Number(
                    values.totalstudents ?? values.total ?? 0
                );

                const boys = Number(
                    values.boys ?? values.boyscount ?? 0
                );

                const girls = Number(
                    values.girls ?? values.girlscount ?? 0
                );

                if (
                    !name ||
                    !Number.isInteger(total) ||
                    !Number.isInteger(boys) ||
                    !Number.isInteger(girls) ||
                    total < 1 ||
                    boys < 0 ||
                    girls < 0 ||
                    boys + girls !== total
                ) {
                    skipped++;
                    return;
                }

                const duplicate = schoolRecords.some(
                    school => school.name.toLowerCase() === name.toLowerCase()
                );

                if (duplicate) {
                    skipped++;
                    return;
                }

                schoolRecords.push({
                    name,
                    total,
                    boys,
                    girls,

                    attendance: values.attendance || "Not provided",
                    transfer: values.transferrate || "Not provided",
                    dropout: values.dropoutrate || "Not provided",

                    transfers: Number(values.transfers || 0),
                    dropouts: Number(values.dropouts || 0),

                    summary:
                        name + " is included in the school education analysis. " +
                        "Its enrollment data is recorded for boys and girls. " +
                        "Attendance monitoring helps understand student participation. " +
                        "Transfer records help identify student movement. " +
                        "Dropout monitoring supports student retention. " +
                        "The school data contributes to gender equality analysis. " +
                        "Further school information can be added by the administrator."
                });

                added++;

            });

            saveSchoolRecords();

            renderDashboardSchools();

            fileInput.value = "";

            alert(
                "Excel upload completed!\n" +
                "Schools added: " + added +
                "\nRows skipped: " + skipped
            );

        } catch (error) {

            alert("Unable to read the file. Please check its format.");

        }

    };

    reader.readAsArrayBuffer(file);

}


// 9. CALCULATE SCHOOL METRICS

function getPercentage(value, total) {

    if (!total || total <= 0) return "N/A";

    return ((value / total) * 100).toFixed(1) + "%";

}

function getSchoolRatio(school) {

    if (!school.boys) {
        return school.girls > 0 ? "Girls only" : "N/A";
    }

    return ((school.girls / school.boys) * 100).toFixed(1)
        + " girls per 100 boys";

}


// 10. INITIALIZE INDIVIDUAL SCHOOL PAGE

function initSchoolProfilePage() {

    const activeIndex = Number(
        localStorage.getItem("activeSchoolIndex")
    );

    if (!Number.isInteger(activeIndex) || !schoolRecords[activeIndex]) {
        const summary = document.getElementById("school-summary-text");

        if (summary) {
            summary.textContent = "Please return to the dashboard and select a school.";
        }

        return;
    }

    const school = schoolRecords[activeIndex];

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText("page-school-title", "📊 " + school.name);

    setText("school-summary-text", school.summary);

    setText(
        "metric-attendance",
        school.attendance || "Not provided"
    );

    setText(
        "metric-transfer",
        school.transfer || "Not provided"
    );

    setText(
        "metric-dropout",
        school.dropout || "Not provided"
    );

    setText("metric-ratio", getSchoolRatio(school));

    // Gender enrollment chart

    const chartCanvas = document.getElementById("schoolDetailChart");

    if (chartCanvas && typeof Chart !== "undefined") {

        if (window.schoolChart) {
            window.schoolChart.destroy();
        }

        window.schoolChart = new Chart(chartCanvas, {

            type: "bar",

            data: {
                labels: ["Boys", "Girls"],

                datasets: [{
                    label: "Student Enrollment",

                    data: [school.boys, school.girls],

                    backgroundColor: [
                        "#526B58",
                        "#49343D"
                    ],

                    borderRadius: 8
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        display: true
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }

        });

    }

    // Scholarship information

    const opportunityList = document.getElementById(
        "opportunities-list"
    );

    if (opportunityList) {

        opportunityList.innerHTML = "";

        const schemes = [
            "National Means-cum-Merit Scholarship (NMMS): For eligible students based on the applicable examination and income criteria.",
            "Pre-Matric and Post-Matric Scholarships: For eligible students under applicable central and state schemes.",
            "Girls' education support: Check currently available state and central schemes specifically for eligible girl students.",
            "Disability scholarships: Opportunities for eligible students with benchmark disabilities.",
            "Other educational support: Check eligibility for textbooks, uniforms, transport and other state education benefits."
        ];

        schemes.forEach(scheme => {

            const li = document.createElement("li");

            li.textContent = scheme;

            opportunityList.appendChild(li);

        });

    }

}


// 11. INDIVIDUAL SCHOOL REPORT DOWNLOAD

function downloadSchoolReport() {

    const activeIndex = Number(
        localStorage.getItem("activeSchoolIndex")
    );

    const school = schoolRecords[activeIndex];

    if (!school) {
        alert("Please select a school first.");
        return;
    }

    const report = `
GENDER RATIO IN SCHOOLING
SCHOOL ANALYTIC REPORT

School Name: ${school.name}

Total Students: ${school.total}
Boys: ${school.boys}
Girls: ${school.girls}

Gender Ratio: ${getSchoolRatio(school)}

Attendance Rate: ${school.attendance || "Not provided"}
Transfer Rate: ${school.transfer || "Not provided"}
Dropout Rate: ${school.dropout || "Not provided"}

SCHOOL SUMMARY

${school.summary}

Note: This report contains the selected school's information only.
    `;

    const blob = new Blob(
        [report],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        school.name.replace(/[^a-z0-9]/gi, "_") + "_Report.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert("School report downloaded successfully!");

}


// 12. PAGE INITIALIZATION

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("school-list-container")) {
        renderDashboardSchools();
    }

    if (document.getElementById("school-summary-text")) {
        initSchoolProfilePage();
    }

});
// Mobile Menu Toggle for Opening Page
const heroMenuBtn = document.getElementById('heroMenuBtn');
const heroDrawer = document.getElementById('heroDrawer');

if (heroMenuBtn && heroDrawer) {
  heroMenuBtn.addEventListener('click', () => {
    const isOpen = heroDrawer.classList.toggle('open');
    heroMenuBtn.textContent = isOpen ? '✕' : '☰';
  });
}

function closeHeroMenu() {
  if (heroDrawer && heroMenuBtn) {
    heroDrawer.classList.remove('open');
    heroMenuBtn.textContent = '☰';
  }
}
// ===== 1. Counter Animation - Home Page =====
let countEl = document.getElementById("schoolCount");
if (countEl) {
  let count = 0;
  let target = 12; // nee schools count
  let timer = setInterval(() => {
    count++;
    countEl.innerText = count;
    if (count >= target) clearInterval(timer);
  }, 100);
}

// ===== 2. Buttons - Home Page =====
let exploreBtn = document.querySelector(".btn-dark");
if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    window.location.href = "school.html";
  });
}

let projectBtn = document.querySelector(".btn-light");
if (projectBtn) {
  projectBtn.addEventListener("click", () => {
    window.location.href = "project.html";
  });
}

// ===== 3. Search Filter - Schools Page =====
let searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keyup", function() {
    let val = this.value.toLowerCase();
    let rows = document.querySelectorAll("#schoolTable tr");
    rows.forEach((row, i) => {
      if (i === 0) return; // header vadiley
      row.style.display = row.innerText.toLowerCase().includes(val) ? "" : "none";
    });
  });
}

// ===== 4. Filter Dropdown - Schools Page =====
let filterSelect = document.getElementById("filterSelect");
if (filterSelect) {
  filterSelect.addEventListener("change", function() {
    let val = this.value;
    let rows = document.querySelectorAll("#schoolTable tr");
    rows.forEach((row, i) => {
      if (i === 0) return;
      if (val === "all") {
        row.style.display = "";
      } else {
        let text = row.innerText.toLowerCase();
        if (val === "balanced" && text.includes("balanced")) row.style.display = "";
        else if (val === "improving" && text.includes("improving")) row.style.display = "";
        else if (val === "attention" && text.includes("needs attention")) row.style.display = "";
        else row.style.display = "none";
      }
    });
  });
}

console.log("Website loaded ✅");
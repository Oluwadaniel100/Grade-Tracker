// Array to store student objects
let students = [];
let nextId = 1;

// Load from localStorage on page load 
window.onload = function () {
    const saved = localStorage.getItem("students");
    if (saved) {
        students = JSON.parse(saved);
        // Set nextId to avoid ID conflicts
        if (students.length > 0) {
            nextId = students[students.length - 1].id + 1;
        }
        renderTable();
        updateAverage();
    }
};

// Add a student
function addStudent() {
    const nameInput = document.getElementById("studentName");
    const gradeInput = document.getElementById("studentGrade");
    const errorMsg = document.getElementById("errorMsg");

    const name = nameInput.value.trim();
    const grade = Number(gradeInput.value);

    // Validation
    if (name === "") {
        errorMsg.textContent = "Student name cannot be empty.";
        return;
    }
    if (gradeInput.value === "" || isNaN(grade) || grade < 0 || grade > 100) {
        errorMsg.textContent = "Grade must be a number between 0 and 100.";
        return;
    }

    errorMsg.textContent = "";

    // Create student object and add to array
    const student = { id: nextId++, name: name, grade: grade };
    students.push(student);

    // Clear inputs
    nameInput.value = "";
    gradeInput.value = "";

    // Save to localStorage 
    saveToLocalStorage();

    renderTable();
    updateAverage();
}

// Delete a student by ID
function deleteStudent(id) {
    students = students.filter(function (s) {
        return s.id !== id;
    });

    saveToLocalStorage();
    renderTable();
    updateAverage();
}

// Render the student table
function renderTable() {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    const avg = calculateAverage();

    students.forEach(function (student) {
        const row = document.createElement("tr");

        // Highlight students above average
        const isAboveAverage = student.grade > avg;
        if (isAboveAverage) {
            row.style.backgroundColor = "#d4edda"; // light green highlight
        }

        row.innerHTML =
            "<td>" + student.id + "</td>" +
            "<td>" + student.name + (isAboveAverage ? " ⭐" : "") + "</td>" +
            "<td>" + student.grade + "</td>" +
            "<td><button onclick='deleteStudent(" + student.id + ")'>Delete</button></td>";

        tbody.appendChild(row);
    });
}

// Calculate the average grade
function calculateAverage() {
    if (students.length === 0) return 0;
        let total = 0;
        for (let i = 0; i < students.length; i++) {
            total = total + students[i].grade;
        }
    return total / students.length;
}

// Update the average grade display
function updateAverage() {
    const avgSpan = document.getElementById("averageGrade");
    if (students.length === 0) {
        avgSpan.textContent = "N/A";
    } else {
        avgSpan.textContent = calculateAverage().toFixed(2);
    }
}

// Save students array to localStorage
function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}
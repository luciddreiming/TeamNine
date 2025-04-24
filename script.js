document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const surveyForm = document.getElementById("survey-form");
    const submissionTableBody = document.querySelector("#submission-table tbody");
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");
    const surveySection = document.getElementById("survey-section");
    const submissionsSection = document.getElementById("submissions-section");
    const logoutBtn = document.getElementById("logout-btn");
    const showSubmissionsBtn = document.getElementById("show-submissions");

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    let currentUser = localStorage.getItem("currentUser");

    function showSection(section) {
        loginSection.style.display = "none";
        signupSection.style.display = "none";
        surveySection.style.display = "none";
        submissionsSection.style.display = "none";

        section.style.display = "block";
    }

    function saveToLocalStorage() {
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("submissions", JSON.stringify(submissions));
    }

    function updateSubmissionTable() {
        submissionTableBody.innerHTML = "";
        submissions.forEach((submission, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${submission.name}</td>
                <td>${submission.grade}</td>
                <td>${submission.section}</td>
                <td>${submission.teacher}</td>
                <td>${submission.subject}</td>
                <td>${"★".repeat(submission.rating)}</td>
                <td>${submission.suggestion}</td>
            `;
            submissionTableBody.appendChild(row);
        });
    }

    if (currentUser) {
        showSection(surveySection);
    } else {
        showSection(loginSection);
    }

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = username;
            localStorage.setItem("currentUser", currentUser);
            showSection(surveySection);
        } else {
            alert("Invalid username or password.");
        }
    });

    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = signupForm.username.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm.confirmPassword.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (users.find(u => u.username === username)) {
            alert("Username already exists.");
            return;
        }

        users.push({ username, password });
        saveToLocalStorage();
        alert("Signup successful. Please log in.");
        showSection(loginSection);
    });

    surveyForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = surveyForm.name.value;
        const grade = surveyForm.grade.value;
        const section = surveyForm.section.value;
        const teacher = surveyForm.teacher.value;
        const subject = surveyForm.subject.value;
        const rating = parseInt(surveyForm.rating.value);
        const suggestion = surveyForm.suggestion.value;

        submissions.push({ name, grade, section, teacher, subject, rating, suggestion });
        saveToLocalStorage();
        alert("Survey submitted successfully.");
        surveyForm.reset();
    });

    showSubmissionsBtn.addEventListener("click", function () {
        updateSubmissionTable();
        showSection(submissionsSection);
    });

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        currentUser = null;
        showSection(loginSection);
    });
});

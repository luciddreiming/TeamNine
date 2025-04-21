document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const serviceSelectionPage = document.getElementById('serviceSelectionPage');
    const schoolSurveyContent = document.getElementById('schoolSurveyContent');
    const healthMonitorContent = document.getElementById('healthMonitorContent');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const healthLogoutBtn = document.getElementById('healthLogoutBtn');
    const schoolLogoutBtn = document.getElementById('schoolLogoutBtn');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const schoolSurveyBtn = document.getElementById('schoolSurveyBtn');
    const healthMonitorBtn = document.getElementById('healthMonitorBtn');
    const healthSurveyForm = document.getElementById('healthSurveyForm');
    const schoolSurveyForm = document.getElementById('schoolSurveyForm');
    const printHealthBtn = document.getElementById('printHealthBtn');
    const healthRecordsTable = document.getElementById('healthRecordsTable');
    const surveyResults = document.getElementById('surveyResults');
    const filterSubject = document.getElementById('filterSubject');
    const filterRating = document.getElementById('filterRating');
    const resetFilters = document.getElementById('resetFilters');
    
    // Data storage
    let userAccounts = [
        { username: 'admin', password: 'admin', name: 'Administrator', email: 'admin@community.gov' }
    ];
    let healthRecords = [];
    let schoolSurveyData = [];

    // Navigation between login and signup
    showSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginPage.style.display = 'none';
        signupPage.style.display = 'flex';
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupPage.style.display = 'none';
        loginPage.style.display = 'flex';
    });

    // Login functionality
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const user = userAccounts.find(account => 
            account.username === username && account.password === password
        );
        
        if (user) {
            loginPage.style.display = 'none';
            signupPage.style.display = 'none';
            serviceSelectionPage.style.display = 'block';
            loginForm.reset();
        } else {
            alert('Invalid username or password');
        }
    });

    // Signup functionality
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (userAccounts.some(account => account.username === username)) {
            alert('Username already exists');
            return;
        }
        
        userAccounts.push({
            username: username,
            password: password,
            name: name,
            email: email
        });
        
        signupPage.style.display = 'none';
        loginPage.style.display = 'flex';
        signupForm.reset();
        alert('Account created successfully! Please login.');
    });

    // Logout functionality
    function logout() {
        loginPage.style.display = 'flex';
        signupPage.style.display = 'none';
        serviceSelectionPage.style.display = 'none';
        schoolSurveyContent.style.display = 'none';
        healthMonitorContent.style.display = 'none';
        
        // Reset forms
        loginForm.reset();
        signupForm.reset();
        healthSurveyForm.reset();
        schoolSurveyForm.reset();
    }

    logoutBtn.addEventListener('click', logout);
    healthLogoutBtn.addEventListener('click', logout);
    schoolLogoutBtn.addEventListener('click', logout);

    // Service selection buttons
    schoolSurveyBtn.addEventListener('click', function() {
        serviceSelectionPage.style.display = 'none';
        schoolSurveyContent.style.display = 'block';
        updateSchoolSurveyTable(); // Initialize table when page loads
    });

    healthMonitorBtn.addEventListener('click', function() {
        serviceSelectionPage.style.display = 'none';
        healthMonitorContent.style.display = 'block';
        updateHealthRecordsTable(); // Initialize table when page loads
    });

    // Health form submission
    healthSurveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            address: document.getElementById('address').value,
            vaccinationStatus: document.getElementById('vaccinationStatus').value,
            symptoms: Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(el => el.value),
            lastCheckup: document.getElementById('lastCheckup').value,
            healthNotes: document.getElementById('healthNotes').value,
            submissionDate: new Date().toLocaleString()
        };
        
        // Add to records
        healthRecords.push(formData);
        updateHealthRecordsTable();
        
        // Show confirmation
        alert('Thank you for submitting your health information!');
        
        // Reset form
        this.reset();
        
        // Return to service selection
        healthMonitorContent.style.display = 'none';
        serviceSelectionPage.style.display = 'block';
    });

    // School form submission
    schoolSurveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const isAnonymous = document.getElementById('anonymousSubmission').checked;
        const studentName = isAnonymous ? 'Anonymous' : document.getElementById('studentName').value || 'Anonymous';
        const teacherName = document.getElementById('teacherName').value;
        const gradeSection = document.getElementById('gradeSection').value;
        const className = document.getElementById('className').value;
        const teacherRating = document.querySelector('input[name="teacherRating"]:checked')?.value;
        const favoriteLesson = document.getElementById('favoriteLesson').value || 'Not specified';
        const suggestions = document.getElementById('suggestions').value || 'No suggestions';
        
        // Validate required fields
        if (!teacherName || !gradeSection || !className || !teacherRating) {
            alert('Please fill in all required fields');
            return;
        }
 
        const newEntry = {
            studentName: studentName,
            teacherName: teacherName,
            gradeSection: gradeSection,
            className: className,
            teacherRating: parseInt(teacherRating),
            favoriteLesson: favoriteLesson,
            suggestions: suggestions,
            submissionDate: new Date().toLocaleDateString()
        };

        schoolSurveyData.push(newEntry);
        updateSchoolSurveyTable();
        schoolSurveyForm.reset();
        document.querySelectorAll('input[name="teacherRating"]').forEach(input => input.checked = false);
        alert('Thank you for your feedback!');
    });

    // Filter event listeners
    filterSubject.addEventListener('change', updateSchoolSurveyTable);
    filterRating.addEventListener('change', updateSchoolSurveyTable);
    resetFilters.addEventListener('click', function() {
        filterSubject.value = 'All Subjects';
        filterRating.value = '0';
        updateSchoolSurveyTable();
    });

    // Update health records table
    function updateHealthRecordsTable() {
        const tbody = healthRecordsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        healthRecords.forEach(record => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${record.fullName}</td>
                <td>${record.age}</td>
                <td>${record.address}</td>
                <td>${record.vaccinationStatus}</td>
                <td>${record.symptoms.join(', ')}</td>
                <td>${record.lastCheckup || 'N/A'}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // Update school survey table with fixed rating filter
    function updateSchoolSurveyTable() {
        surveyResults.innerHTML = '';
        
        const subjectFilter = filterSubject.value;
        const ratingFilter = parseInt(filterRating.value);
        
        const filteredData = schoolSurveyData.filter(entry => {
            // Subject filter
            const matchesSubject = subjectFilter === "All Subjects" || entry.className === subjectFilter;
            
            // Rating filter - fixed comparison
            const matchesRating = ratingFilter === 0 || entry.teacherRating === ratingFilter;
            
            return matchesSubject && matchesRating;
        });
        
        filteredData.forEach(entry => {
            const row = document.createElement('tr');
            
            const starsDisplay = '★'.repeat(entry.teacherRating) + '☆'.repeat(5 - entry.teacherRating);
            
            row.innerHTML = `
                <td>${entry.studentName}</td>
                <td>${entry.teacherName}</td>
                <td>${entry.gradeSection}</td>
                <td>${entry.className}</td>
                <td>${starsDisplay}</td>
                <td>${entry.favoriteLesson}</td>
                <td>${entry.suggestions}</td>
            `;
            
            surveyResults.appendChild(row);
        });
        
        if (filteredData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="7" style="text-align: center;">No survey results found matching your filters</td>`;
            surveyResults.appendChild(row);
        }
    }

    // Print health records
    printHealthBtn.addEventListener('click', function() {
        document.querySelector('.health-records').style.display = 'block';
        window.print();
        document.querySelector('.health-records').style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
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
    const printDate = document.getElementById('printDate');
    const recordCount = document.getElementById('recordCount');
    const togglePasswordLogin = document.getElementById('togglePasswordLogin');
    const togglePasswordSignup = document.getElementById('togglePasswordSignup');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const capsWarningLogin = document.getElementById('capsWarningLogin');
    const capsWarningSignup = document.getElementById('capsWarningSignup');
    const passwordLogin = document.getElementById('password');
    const passwordSignup = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('signupConfirmPassword');

    let userAccounts = [
        { 
            username: 'admin', 
            password: 'admin', 
            name: 'Administrator', 
            email: 'admin@community.gov',
            isStudent: true 
        }
    ];
    let healthRecords = [];
    let schoolSurveyData = [];

    function initEventListeners() {
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

        togglePasswordLogin.addEventListener('click', function() {
            togglePasswordVisibility(passwordLogin, togglePasswordLogin);
        });

        togglePasswordSignup.addEventListener('click', function() {
            togglePasswordVisibility(passwordSignup, togglePasswordSignup);
        });

        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility(confirmPassword, toggleConfirmPassword);
        });

        passwordLogin.addEventListener('keyup', checkCapsLock);
        passwordLogin.addEventListener('keydown', checkCapsLock);
        passwordSignup.addEventListener('keyup', checkCapsLock);
        passwordSignup.addEventListener('keydown', checkCapsLock);
        confirmPassword.addEventListener('keyup', checkCapsLock);
        confirmPassword.addEventListener('keydown', checkCapsLock);

        loginForm.addEventListener('submit', handleLogin);
        signupForm.addEventListener('submit', handleSignup);
        logoutBtn.addEventListener('click', logout);
        healthLogoutBtn.addEventListener('click', logout);
        schoolLogoutBtn.addEventListener('click', logout);
        schoolSurveyBtn.addEventListener('click', showSchoolSurvey);
        healthMonitorBtn.addEventListener('click', showHealthMonitor);
        healthSurveyForm.addEventListener('submit', handleHealthFormSubmit);
        schoolSurveyForm.addEventListener('submit', handleSchoolFormSubmit);
        filterSubject.addEventListener('change', updateSchoolSurveyTable);
        filterRating.addEventListener('change', updateSchoolSurveyTable);
        resetFilters.addEventListener('click', resetSchoolFilters);
        printHealthBtn.addEventListener('click', printHealthRecords);
    }

    function togglePasswordVisibility(inputField, toggleButton) {
        if (inputField.type === 'password') {
            inputField.type = 'text';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
                    <path d="M22 2L2 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
        } else {
            inputField.type = 'password';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6c-3.95 0-7.2 2.3-9 6 1.8 3.7 5.05 6 9 6s7.2-2.3 9-6c-1.8-3.7-5.05-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 0 0 9.5 12 2.5 2.5 0 0 0 12 14.5 2.5 2.5 0 0 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/>
                </svg>
            `;
        }
    }

    function checkCapsLock(e) {
        const isCapsLockOn = e.getModifierState && e.getModifierState('CapsLock');

        if (e.target === passwordLogin) {
            capsWarningLogin.style.display = isCapsLockOn ? 'block' : 'none';
        } else if (e.target === passwordSignup || e.target === confirmPassword) {
            capsWarningSignup.style.display = isCapsLockOn ? 'block' : 'none';
        }
    }

// After successful login
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = userAccounts.find(account => 
        account.username === username && account.password === password
    );

    if (user) {
        // Store current user in session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        if (!user.isStudent) {
            document.getElementById('schoolSurveyBtn').disabled = true;
            document.getElementById('schoolSurveyBtn').style.opacity = '0.6';
            document.getElementById('schoolSurveyBtn').title = 'This service is only available to students';
        } else {
            document.getElementById('schoolSurveyBtn').disabled = false;
            document.getElementById('schoolSurveyBtn').style.opacity = '1';
            document.getElementById('schoolSurveyBtn').title = '';
        }
        
        loginPage.style.display = 'none';
        signupPage.style.display = 'none';
        serviceSelectionPage.style.display = 'block';
        loginForm.reset();
    } else {
        alert('Invalid username or password');
    }
}

        function showSchoolSurvey() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));    
        if (!currentUser || !currentUser.isStudent) {
        alert('This service is only available to students.');
        return;
    }
    
    serviceSelectionPage.style.display = 'none';
    schoolSurveyContent.style.display = 'block';
    updateSchoolSurveyTable();
}

    function handleSignup(e) {
        e.preventDefault();
    
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const isStudent = document.getElementById('studentVerification').value === 'student';
    
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        if (userAccounts.some(account => account.username === username)) {
            alert('Username already exists');
            return;
        }
    
        userAccounts.push({ 
            username, 
            password, 
            name, 
            email,
            isStudent 
        });
    
        signupPage.style.display = 'none';
        loginPage.style.display = 'flex';
        signupForm.reset();
        alert('Account created successfully! Please login.');
    }

    function logout() {
        loginPage.style.display = 'flex';
        signupPage.style.display = 'none';
        serviceSelectionPage.style.display = 'none';
        schoolSurveyContent.style.display = 'none';
        healthMonitorContent.style.display = 'none';

        loginForm.reset();
        signupForm.reset();
        healthSurveyForm.reset();
        schoolSurveyForm.reset();
    }

    function showSchoolSurvey() {
        serviceSelectionPage.style.display = 'none';
        schoolSurveyContent.style.display = 'block';
        updateSchoolSurveyTable();
    }

    function showHealthMonitor() {
        serviceSelectionPage.style.display = 'none';
        healthMonitorContent.style.display = 'block';
        updateHealthRecordsTable();
    }

    function handleHealthFormSubmit(e) {
        e.preventDefault();

        const checkedSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(el => el.value);
        const finalSymptoms = checkedSymptoms.includes("None") ? ["None"] : checkedSymptoms;
        const otherSymptoms = document.getElementById('otherSymptoms').value.trim();
        if (otherSymptoms && !finalSymptoms.includes("None")) {
            finalSymptoms.push(otherSymptoms);
    }


        const formData = {
            fullName: document.getElementById('fullName').value,
            purok: document.getElementById('purok').value,
            streetAddress: document.getElementById('streetAddress').value,
            age: document.getElementById('age').value,
            contactNumbers: document.getElementById('contactNumbers').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            vaccinationStatus: document.getElementById('vaccinationStatus').value,
            symptoms: finalSymptoms,
            lastCheckup: document.getElementById('lastCheckup').value,
            healthNotes: document.getElementById('healthNotes').value,
            submissionDate: new Date().toLocaleString()
        };

        healthRecords.push(formData);
        updateHealthRecordsTable();
        alert('Thank you for submitting your health information!');
        healthSurveyForm.reset();
    }

    function handleSchoolFormSubmit(e) {
        e.preventDefault();

        const isAnonymous = document.getElementById('anonymousSubmission').checked;
        const studentName = isAnonymous ? 'Anonymous' : document.getElementById('studentName').value || 'Anonymous';
        const teacherName = document.getElementById('teacherName').value;
        const gradeSection = document.getElementById('gradeSection').value;
        const className = document.getElementById('className').value;
        const teacherRating = parseInt(document.querySelector('input[name="teacherRating"]:checked')?.value);
        const favoriteLesson = document.getElementById('favoriteLesson').value || 'Not specified';
        const suggestions = document.getElementById('suggestions').value || 'No suggestions';

        if (!teacherName || !gradeSection || !className || !teacherRating) {
            alert('Please fill in all required fields');
            return;
        }

        const newEntry = {
            studentName,
            teacherName,
            gradeSection,
            className,
            teacherRating,
            favoriteLesson,
            suggestions,
            submissionDate: new Date().toLocaleDateString()
        };

        schoolSurveyData.push(newEntry);
        updateSchoolSurveyTable();
        schoolSurveyForm.reset();
        document.querySelectorAll('input[name="teacherRating"]').forEach(input => input.checked = false);
        alert('Thank you for your feedback!');
    }

    function resetSchoolFilters() {
        filterSubject.value = 'All Subjects';
        filterRating.value = '0';
        updateSchoolSurveyTable();
    }

    function updateHealthRecordsTable() {
        const tbody = healthRecordsTable.querySelector('tbody');
        tbody.innerHTML = '';

        if (healthRecords.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No health records found</td></tr>`;
            return;
        }

        healthRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.fullName}</td>
                <td>${record.purok}</td>
                <td>${record.streetAddress}</td>
                <td>${record.age}</td>
                <td>${record.contactNumbers}</td>
                <td>${record.vaccinationStatus}</td>
                <td>${record.symptoms || 'None'}</td>
                <td>${record.lastCheckup || 'None'}</td>
                <td>${record.healthNotes || 'None'}</td>`;
            tbody.appendChild(row);
        });
    }

    function updateSchoolSurveyTable() {
        surveyResults.innerHTML = '';

        const subjectFilter = filterSubject.value;
        const ratingFilter = parseInt(filterRating.value);

        const filteredData = schoolSurveyData.filter(entry => {
            const matchesSubject = subjectFilter === 'All Subjects' || entry.className === subjectFilter;
            const matchesRating = ratingFilter === 0 || entry.teacherRating === ratingFilter;
            return matchesSubject && matchesRating;
        });

        if (filteredData.length === 0) {
            surveyResults.innerHTML = `<tr><td colspan="7">No survey results found</td></tr>`;
            return;
        }

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
                <td>${entry.suggestions}</td>`;
            surveyResults.appendChild(row);
        });
    }

    function printHealthRecords() {
    printDate.textContent = new Date().toLocaleString();
    recordCount.textContent = healthRecords.length;

        const printHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Barangay Health Records</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 15px; 
                -webkit-text-size-adjust: 100%;
            }
            .print-header { 
                display: flex;
                justify-content: space-between;
                text-align: center; 
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .print-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                font-size: 14px;
                color: #666;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 12px;
            }
            th, td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #166088;
                color: white;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
            .print-footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 10px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
            }
            @page {
                size: auto;
                margin: 10mm;
            }
            @media print {
                body {
                    padding: 0;
                    font-size: 10px;
                }
                table {
                    font-size: 10px;
                }
                th, td {
                    padding: 5px;
                }
            }
        </style>
    </head>
    <body>
        <div class="print-header">
            <img src="images/barangay_seal.png" alt="barangay_seal" width="100px" height="100px">
            <h2>Barangay Health Records</h2>
            <img src="images/municipal_health.png" alt="municipal_health" width="100px" height="100px">
            <div class="print-info">
                <p>Printed on: <span id="printDate">${new Date().toLocaleString()}</span></p>
                <p>Total records: <span id="recordCount">${healthRecords.length}</span></p>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Purok</th>
                    <th>Address</th>
                    <th>Age</th>
                    <th>Contact</th>
                    <th>Vaccination</th>
                    <th>Symptoms</th>
                    <th>Last Checkup</th>
                    <th>Additional Health Notes</th>
                </tr>
            </thead>
            <tbody>
                ${healthRecords.map(record => `
                    <tr>
                        <td>${record.fullName}</td>
                        <td>${record.purok}</td>
                        <td>${record.streetAddress}</td>
                        <td>${record.age}</td>
                        <td>${record.contactNumbers}</td>
                        <td>${record.vaccinationStatus}</td>
                        <td>${record.symptoms.length > 0 ? record.symptoms.join(', ') : 'None'}</td>
                        <td>${record.lastCheckup || 'None'}</td>
                        <td>${record.healthNotes || 'None'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="print-footer">
            <p>Barangay Health Monitoring System - Confidential</p>
        </div>
        <script>
            setTimeout(function() {
                try {
                    window.print();
                } catch(e) {
                    console.log('Printing not available', e);
                }
            }, 300);
        </script>
    </body>
    </html>
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(printHtml);
        printWindow.document.close();

        setTimeout(() => {
            try {
                printWindow.focus();
            } catch(e) {
                console.log('Could not focus window', e);
            }
        }, 500);
    }
        printSection.style.display = 'none';
    
        function cleanupPrint() {
            if (printContent.parentNode) {
                printContent.parentNode.removeChild(printContent);
            }
            const style = document.getElementById('print-styles');
            if (style) {
                style.parentNode.removeChild(style);
            }
        }
        setTimeout(cleanupPrint, 5000);

    initEventListeners();
});

/*nav bar */
const nav = document.querySelector('nav');

        window.addEventListener('scroll', () => {
            if (window.scrollY >= 210) {
                nav.classList.add('active_nav');
            } else {
                nav.classList.remove('active_nav');
            }
        })


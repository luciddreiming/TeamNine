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
        { username: 'admin', password: 'admin', name: 'Administrator', email: 'admin@community.gov' }
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

    function handleLogin(e) {
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
    }

    function handleSignup(e) {
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

        let finalSymptoms = checkedSymptoms.includes("None") ? ["None"] : checkedSymptoms;

        const otherSymptoms = document.getElementById('otherSymptoms').value.trim();
        if (otherSymptoms && !finalSymptoms.includes("None")) {
            finalSymptoms.push(otherSymptoms);
        }

        if (!document.getElementById('fullName').value || 
            !document.getElementById('purok').value ||
            !document.getElementById('streetAddress').value ||
            !document.getElementById('age').value ||
            !document.getElementById('contactNumbers').value ||
            !document.querySelector('input[name="gender"]:checked') ||
            !document.getElementById('vaccinationStatus').value) {
            alert('Please fill in all required fields');
            return;
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
        this.reset();
    }

    function handleSchoolFormSubmit(e) {
        e.preventDefault();
        
        const isAnonymous = document.getElementById('anonymousSubmission').checked;
        const studentName = isAnonymous ? 'Anonymous' : document.getElementById('studentName').value || 'Anonymous';
        const teacherName = document.getElementById('teacherName').value;
        const gradeSection = document.getElementById('gradeSection').value;
        const className = document.getElementById('className').value;
        const teacherRating = document.querySelector('input[name="teacherRating"]:checked')?.value;
        const favoriteLesson = document.getElementById('favoriteLesson').value || 'Not specified';
        const suggestions = document.getElementById('suggestions').value || 'No suggestions';

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
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="8" style="text-align: center;">No health records found</td>`;
            tbody.appendChild(row);
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
                <td>${record.symptoms.join(', ')}</td>
                <td>${record.lastCheckup || 'N/A'}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    function updateSchoolSurveyTable() {
        surveyResults.innerHTML = '';
        
        const subjectFilter = filterSubject.value;
        const ratingFilter = parseInt(filterRating.value);
        
        const filteredData = schoolSurveyData.filter(entry => {
            const matchesSubject = subjectFilter === "All Subjects" || entry.className === subjectFilter;
            const matchesRating = ratingFilter === 0 || entry.teacherRating >= ratingFilter; 
            return matchesSubject && matchesRating;
        });
        
        if (filteredData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="7" style="text-align: center;">No survey results found matching your filters</td>`;
            surveyResults.appendChild(row);
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
                <td>${entry.suggestions}</td>
            `;           
            surveyResults.appendChild(row);
        });
    }

    function printHealthRecords() {
        printDate.textContent = new Date().toLocaleString();
        recordCount.textContent = healthRecords.length;

        document.getElementById('printSection').style.display = 'block';

        // Create mobile-friendly print styles
        const style = document.createElement('style');
        style.id = 'print-styles';
        style.innerHTML = `
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                    font-size: 12px;
                }
                table {
                    width: 100% !important;
                    page-break-inside: auto;
                    font-size: 10px;
                }
                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                #printSection {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    margin: 0;
                    padding: 5px;
                }
                th, td {
                    padding: 4px 6px !important;
                }
            }
        `;
        document.head.appendChild(style);

        // For mobile devices, we might need to use a print-friendly layout
        if (window.innerWidth <= 768) {
            const printStyle = document.createElement('style');
            printStyle.innerHTML = `
                @media print {
                    table {
                        font-size: 8px;
                    }
                    th, td {
                        padding: 2px 4px !important;
                    }
                }
            `;
            document.head.appendChild(printStyle);
        }

        setTimeout(() => {
            window.print();
            document.getElementById('printSection').style.display = 'none';
            // Remove all print-related styles
            const printStyles = document.querySelectorAll('style#print-styles, style[media="print"]');
            printStyles.forEach(style => document.head.removeChild(style));
        }, 100);
    }

    // Initialize all event listeners when the DOM is fully loaded
    initEventListeners();
});

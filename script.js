// Hamburger Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.querySelector('.close-sidebar');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('nav-active');
        menuToggle.classList.toggle('active', isActive);
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            menuToggle.classList.remove('active');
        }
    });
}

if (hamburgerMenu && sidebar && closeSidebar) {
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
    });

    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburgerMenu.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Improved Password Toggle Functions
function togglePassword() {
    const password = document.getElementById('password');
    const toggle = password.parentElement.querySelector('.toggle-password');
    togglePasswordVisibility(password, toggle);
}

function toggleLoginPassword() {
    const password = document.getElementById('login-password');
    const toggle = password.parentElement.querySelector('.toggle-password');
    togglePasswordVisibility(password, toggle);
}

function togglePasswordVisibility(passwordField, toggleIcon) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}// Unified Password Toggle Functions
function togglePasswordVisibility(passwordField, toggleIcon) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Registration page toggle
function togglePassword() {
    const password = document.getElementById('password');
    const toggle = document.querySelector('#auth-form .toggle-password');
    togglePasswordVisibility(password, toggle);
}

// Login page toggle
function toggleLoginPassword() {
    const password = document.getElementById('login-password');
    const toggle = document.getElementById('toggleLoginPassword');
    if (password && toggle) {
        togglePasswordVisibility(password, toggle);
    }
}

// Add event listeners when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Login page eye icon
    const loginToggle = document.getElementById('toggleLoginPassword');
    if (loginToggle) {
        loginToggle.addEventListener('click', toggleLoginPassword);
    }
    
    // Registration page eye icon
    const regToggle = document.querySelector('#auth-form .toggle-password');
    if (regToggle) {
        regToggle.addEventListener('click', togglePassword);
    }
});

// Registration with Re-Validation
const authForm = document.getElementById('auth-form');
const authMessage = document.getElementById('auth-message');
const extraFields = document.getElementById('extra-fields');
const usernameInput = document.getElementById('username');
const usernameFeedback = document.getElementById('username-feedback');
const passwordInput = document.getElementById('password');
const passwordFeedback = document.getElementById('password-feedback');
const registerBtn = document.getElementById('register-btn');
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// New variables for multi-step form
let currentExtraStep = 1;
let selectedGoal = null;
let selectedEducation = null;
let professionalInfo = {};

if (authForm) {
    function validateForm() {
        const firstName = authForm.querySelector('[name="firstName"]').value.trim();
        const lastName = authForm.querySelector('[name="lastName"]').value.trim();
        const email = authForm.querySelector('[name="email"]').value.trim();
        const password = authForm.querySelector('[name="password"]').value.trim();
        const role = authForm.querySelector('[name="role"]').value;
        const username = authForm.querySelector('[name="username"]').value.trim();
        const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

        authForm.querySelectorAll('.input-group').forEach(group => group.classList.remove('invalid'));
        if (!firstName) authForm.querySelector('[name="firstName"]').parentElement.classList.add('invalid');
        if (!lastName) authForm.querySelector('[name="lastName"]').parentElement.classList.add('invalid');
        if (!email) authForm.querySelector('[name="email"]').parentElement.classList.add('invalid');
        if (!isValidPassword) authForm.querySelector('[name="password"]').parentElement.classList.add('invalid');
        if (!role) authForm.querySelector('[name="role"]').parentElement.classList.add('invalid');
        if (!username) authForm.querySelector('[name="username"]').parentElement.classList.add('invalid');

        registerBtn.disabled = !(firstName && lastName && email && password && role && username && isValidPassword);
        if (passwordInput.value) updatePasswordFeedback();
    }

    function updatePasswordFeedback() {
        const password = passwordInput.value;
        const checks = [
            { text: 'Minimum of 8 characters', test: (p) => p.length >= 8 },
            { text: 'One lowercase', test: (p) => /[a-z]/.test(p) },
            { text: 'One uppercase', test: (p) => /[A-Z]/.test(p) },
            { text: 'One number', test: (p) => /\d/.test(p) },
            { text: 'One special character', test: (p) => /[!@#$%^&*]/.test(p) }
        ];
        passwordFeedback.style.display = 'block';
        passwordFeedback.innerHTML = checks.map(check => 
            `<span class="${check.test(password) ? 'valid' : 'invalid'}">${check.text}</span>`
        ).join('');
    }

    // New functions for multi-step form
    function showExtraFields(role) {
        extraFields.style.display = 'block';
        currentExtraStep = 1;
        updateProgressIndicator();
        
        // Reset selections
        document.querySelectorAll('.goal-card, .edu-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Update UI based on role
        const studentGoals = document.querySelectorAll('.student-goal');
        const mentorGoals = document.querySelectorAll('.mentor-goal');
        
        if (role === 'student') {
            studentGoals.forEach(goal => goal.style.display = 'block');
            mentorGoals.forEach(goal => goal.style.display = 'none');
        } else {
            studentGoals.forEach(goal => goal.style.display = 'none');
            mentorGoals.forEach(goal => goal.style.display = 'block');
        }
    }

    function updateProgressIndicator() {
        const progressElement = document.querySelector('.progress-indicator');
        if (progressElement) {
            progressElement.querySelector('.current-step').textContent = currentExtraStep;
        }
        
        document.querySelectorAll('.extra-step').forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentExtraStep) {
                step.classList.add('active');
            }
        });
    }

    function collectProfessionalInfo() {
    professionalInfo = {
        currentJob: document.querySelector('[name="currentJob"]')?.value.trim() || '',
        yearsExperience: document.querySelector('[name="yearsExperience"]')?.value.trim() || '',
        education: selectedEducation,
        goal: selectedGoal
    };
}

    // Event delegation for card selections and navigation
    document.addEventListener('click', function(e) {
        // Goal selection
        if (e.target.closest('.goal-card')) {
            const card = e.target.closest('.goal-card');
            document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedGoal = card.dataset.goal;
        }
        
        // Education selection
        if (e.target.closest('.edu-card')) {
            const card = e.target.closest('.edu-card');
            document.querySelectorAll('.edu-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedEducation = card.dataset.education;
        }
        
        // Navigation buttons
        if (e.target.classList.contains('next-btn')) {
            if (currentExtraStep === 1 && !selectedGoal) {
                authMessage.textContent = 'Please select a goal before continuing';
                authMessage.classList.add('error');
                authMessage.style.display = 'block';
                return;
            }
            
            if (currentExtraStep === 2) {
                collectProfessionalInfo();
            }
            
            currentExtraStep++;
            updateProgressIndicator();
        }
        
        if (e.target.classList.contains('back-btn')) {
            currentExtraStep--;
            updateProgressIndicator();
        }
        // Replace the existing click handler for complete-btn with this:
document.addEventListener('click', function(e) {
    // ... (keep other existing click handlers)
    
    if (e.target.classList.contains('complete-btn')) {
        if (!selectedEducation) {
            authMessage.textContent = 'Please select your education level';
            authMessage.classList.add('error');
            authMessage.style.display = 'block';
            return;
        }
        collectProfessionalInfo();
        completeRegistration(); // Call the new registration function
    }
});

// Add this new function to handle the final registration
function completeRegistration() {
    const formData = new FormData(authForm);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const username = formData.get('username');
    const currentJob = professionalInfo.currentJob;
    const yearsExperience = professionalInfo.yearsExperience;

    // Prepare user data with all collected information
    const userData = {
        firstName,
        lastName,
        email,
        username,
        password,
        role,
        goal: selectedGoal,
        education: selectedEducation,
        sessions: [],
        badges: [],
        currentJob,
        yearsExperience,
        ...(role === 'mentor' ? { 
            expertise: [professionalInfo.currentJob],
            mentors: []
        } : {
            mentorType: professionalInfo.currentJob
        })
    };

    // Check if user already exists
    const userExists = users.some(u => u.username === username || u.email === email);
    if (userExists) {
        authMessage.textContent = 'Username or email already taken. Please choose another.';
        authMessage.classList.add('error');
        authMessage.style.display = 'block';
        return;
    }

    // Save user data
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    currentUser = { ...userData };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show success message and redirect
    authMessage.textContent = 'Account successfully created!';
    authMessage.classList.remove('error');
    authMessage.style.display = 'block';
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
}
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value) {
            passwordFeedback.style.display = 'block';
            updatePasswordFeedback();
        } else {
            passwordFeedback.style.display = 'none';
        }
        validateForm();
    });

    authForm.addEventListener('input', validateForm);

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(authForm);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');
        const username = formData.get('username');

        const userExists = users.find(u => u.username === username || u.email === email);
        if (userExists) {
            authMessage.textContent = 'Username or email already taken. Please choose another.';
            authMessage.classList.add('error');
            authMessage.style.display = 'block';
            return;
        }

        // Set up the multi-step extra fields
        extraFields.innerHTML = `
            <div class="progress-indicator">
                Step <span class="current-step">1</span> of 3
            </div>

            <!-- Step 1: Goal Selection -->
            <div class="extra-step active" data-step="1">
                <h3>Tell us about your goals</h3>
                
                <div class="goal-options">
                    <!-- Student Goals -->
                    <div class="goal-card student-goal" data-goal="start_career" style="display:none;">
                        <h4>Start my career</h4>
                        <p>I'm looking to enter a new field</p>
                    </div>
                    <div class="goal-card student-goal" data-goal="change_career" style="display:none;">
                        <h4>Change my career</h4>
                        <p>I want to transition to a different field</p>
                    </div>
                    <div class="goal-card student-goal" data-goal="skill_development" style="display:none;">
                        <h4>Develop specific skills</h4>
                        <p>I want to improve in my current role</p>
                    </div>
                    
                    <!-- Mentor Goals -->
                    <div class="goal-card mentor-goal" data-goal="mentor_juniors" style="display:none;">
                        <h4>Mentor junior professionals</h4>
                        <p>I want to guide those starting their careers</p>
                    </div>
                    <div class="goal-card mentor-goal" data-goal="share_expertise" style="display:none;">
                        <h4>Share my expertise</h4>
                        <p>I want to teach specific skills</p>
                    </div>
                    <div class="goal-card mentor-goal" data-goal="career_guidance" style="display:none;">
                        <h4>Provide career guidance</h4>
                        <p>I want to help with career transitions</p>
                    </div>
                </div>
                
                <div class="form-nav">
                    <button type="button" class="next-btn">Next →</button>
                </div>
            </div>

            <!-- Step 2: Professional Background -->
            <div class="extra-step" data-step="2">
                <h3>Professional Background</h3>
                
                <div class="input-group">
                    <input type="text" placeholder="${role === 'student' ? 'Current job title (if any)' : 'Current job title'}" 
                           name="currentJob" ${role === 'mentor' ? 'required' : ''}>
                    <span class="input-border"></span>
                </div>
                
                ${role === 'mentor' ? `
                <div class="input-group">
                    <input type="text" placeholder="Years of experience" name="yearsExperience" required>
                    <span class="input-border"></span>
                </div>
                ` : ''}
                
                <div class="form-nav">
                    <button type="button" class="back-btn">← Back</button>
                    <button type="button" class="next-btn">Next →</button>
                </div>
            </div>

            <!-- Step 3: Education -->
            <div class="extra-step" data-step="3">
                <h3>Education Background</h3>
                
                <div class="education-options">
                    <div class="edu-card" data-education="high_school">
                        <h4>High school diploma</h4>
                        <p>Or equivalent</p>
                    </div>
                    <div class="edu-card" data-education="bachelors">
                        <h4>Bachelor's degree</h4>
                        <p>BA, BS, or similar</p>
                    </div>
                    <div class="edu-card" data-education="masters">
                        <h4>Master's degree</h4>
                        <p>MA, MS, or similar</p>
                    </div>
                    ${role === 'mentor' ? `
                    <div class="edu-card" data-education="phd">
                        <h4>Doctoral degree</h4>
                        <p>PhD, MD, JD, or similar</p>
                    </div>
                    ` : ''}
                </div>
                
                <div class="form-nav">
                    <button type="button" class="back-btn">← Back</button>
                    <button type="button" class="complete-btn">Complete Registration</button>
                </div>
            </div>
        `;

        extraFields.style.display = 'block';
        showExtraFields(role);
    });

    // Username generation and validation
    const firstNameInput = authForm.querySelector('[name="firstName"]');
    const lastNameInput = authForm.querySelector('[name="lastName"]');
    let timeout;

    [firstNameInput, lastNameInput].forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const first = firstNameInput.value.trim().toLowerCase();
                const last = lastNameInput.value.trim().toLowerCase();
                if (first && last) {
                    const separators = ['_', '-', '.'];
                    const randomSep = separators[Math.floor(Math.random() * separators.length)];
                    let suggestedUsername = `${first}${randomSep}${last}`;
                    let counter = 1;
                    while (users.some(u => u.username === suggestedUsername)) {
                        suggestedUsername = `${first}${randomSep}${last}${counter}`;
                        counter++;
                    }
                    usernameInput.value = suggestedUsername;
                    checkUsernameAvailability(suggestedUsername);
                }
            }, 300);
        });
    });

    usernameInput.addEventListener('input', () => {
        checkUsernameAvailability(usernameInput.value);
    });

    function checkUsernameAvailability(username) {
        const isValid = /^[a-zA-Z0-9._-]+$/.test(username);
        const isTaken = users.some(u => u.username === username);
        usernameFeedback.textContent = isValid ? (isTaken ? 'Username taken. Try another.' : 'Username available!') : 'Use letters, numbers, ., _ or - only.';
        usernameFeedback.style.color = isValid ? (isTaken ? '#e74c3c' : '#2ecc71') : '#e74c3c';
    }
}

// Sign-In
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const forgotPassword = document.getElementById('forgot-password');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const identifier = formData.get('identifier');
        const password = formData.get('password');
        let users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);
        if (user) {
            currentUser = { ...user };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loginMessage.textContent = 'Logged in successfully! Redirecting...';
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } else {
            loginMessage.textContent = 'Invalid username, email, or password.';
        }
    });
}

if (forgotPassword) {
    forgotPassword.addEventListener('click', () => {
        loginMessage.textContent = 'Password reset link sent! (Placeholder - Check email setup for real implementation)';
    });
}

// Dashboard Functionality
if (window.location.pathname.includes('dashboard.html')) {
    const logout = document.querySelector('.logout');
    const searchForm = document.getElementById('search-form');
    const mentorList = document.getElementById('mentor-list');
    const mentorSelect = document.getElementById('mentor-select');
    const sessionDate = document.getElementById('session-date');
    const bookSession = document.getElementById('book-session');
    const scheduleList = document.getElementById('schedule-list');
    const sessionNotes = document.getElementById('session-notes');
    const saveNotes = document.getElementById('save-notes');
    const notesList = document.getElementById('notes-list');
    const trainingSelect = document.getElementById('training-select');
    const startTraining = document.getElementById('start-training');
    const trainingContent = document.getElementById('training-content');
    const notifications = document.getElementById('notifications');
    const sessionOverview = document.getElementById('session-overview');

    if (!currentUser) {
        alert('Please log in first!');
        window.location.href = 'login.html';
    }

    if (logout) {
        logout.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    if (searchForm && mentorList) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(searchForm);
            const expertise = formData.get('expertise').toLowerCase();
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const mentors = users.filter(u => u.role === 'mentor' && u.expertise && u.expertise.some(e => e.toLowerCase().includes(expertise)));

            mentorList.innerHTML = '';
            if (mentors.length > 0) {
                mentors.forEach(mentor => {
                    const div = document.createElement('div');
                    div.textContent = `${mentor.username} - Expertise: ${mentor.expertise.join(', ')}`;
                    div.className = 'mentor-item';
                    mentorList.appendChild(div);
                });
            } else {
                mentorList.innerHTML = '<div class="mentor-item">No mentors found.</div>';
            }
            searchForm.reset();
        });
    }

    if (mentorSelect && sessionDate && bookSession && scheduleList) {
        function populateMentors() {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            mentorSelect.innerHTML = '<option value="">Select a Mentor</option>';
            const mentors = users.filter(u => u.role === 'mentor' && u.expertise);
            mentors.forEach(mentor => {
                const option = document.createElement('option');
                option.value = mentor.username;
                option.textContent = `${mentor.username} (Expertise: ${mentor.expertise.join(', ')})`;
                mentorSelect.appendChild(option);
            });
        }

        bookSession.addEventListener('click', () => {
            if (currentUser.role !== 'student' || !mentorSelect.value || !sessionDate.value) {
                alert('Please log in as a student and select a mentor/date.');
                return;
            }
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const mentor = users.find(u => u.username === mentorSelect.value);
            if (mentor) {
                mentor.sessions = mentor.sessions || [];
                mentor.sessions.push({ student: currentUser.username, date: sessionDate.value, status: 'pending' });
                currentUser.sessions = currentUser.sessions || [];
                currentUser.sessions.push({ mentor: mentor.username, date: sessionDate.value, status: 'pending' });
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                const div = document.createElement('div');
                div.textContent = `Session booked with ${mentor.username} on ${sessionDate.value} (Pending)`;
                div.className = 'schedule-item';
                scheduleList.appendChild(div);
                sessionDate.value = '';
                if (currentUser.badges.indexOf('First Session') === -1) {
                    currentUser.badges.push('First Session');
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    alert('Congratulations! You earned the "First Session" badge!');
                }
                updateNotifications();
            }
        });

        populateMentors();
    }

    if (sessionNotes && saveNotes && notesList) {
        saveNotes.addEventListener('click', () => {
            if (!currentUser || !sessionNotes.value) {
                alert('Please log in and enter notes.');
                return;
            }
            currentUser.sessions = currentUser.sessions || [];
            const lastSession = currentUser.sessions[currentUser.sessions.length - 1];
            if (lastSession) {
                lastSession.notes = sessionNotes.value;
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users));
                }
                const div = document.createElement('div');
                div.textContent = `Notes saved: ${sessionNotes.value} (Date: ${new Date().toLocaleDateString()})`;
                div.className = 'notes-item';
                notesList.appendChild(div);
                if (currentUser.badges.indexOf('Note Taker') === -1 && sessionNotes.value.length > 10) {
                    currentUser.badges.push('Note Taker');
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    alert('Congratulations! You earned the "Note Taker" badge!');
                }
            } else {
                alert('No session to add notes to. Book a session first.');
            }
            sessionNotes.value = '';
        });
    }

    if (trainingSelect && startTraining && trainingContent) {
        startTraining.addEventListener('click', () => {
            const module = trainingSelect.value;
            if (module) {
                trainingContent.innerHTML = `<p>Training content for ${module}: Watch this video or read the guide (placeholder).</p>`;
            } else {
                trainingContent.innerHTML = '<p>Please select a training module.</p>';
            }
        });
    }

 // Dynamic Section Toggling
const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('href').substring(1);
        document.querySelectorAll('.dashboard-card').forEach(card => card.style.display = 'none');
        const section = document.getElementById(target);
        if (section) {
            section.style.display = 'block';
            if (target === 'profile') {
                document.getElementById('profile-name').value = currentUser ? currentUser.firstName + ' ' + currentUser.lastName : '';
                document.getElementById('profile-role').value = currentUser ? currentUser.role : '';
                document.getElementById('profile-badges').innerHTML = currentUser && currentUser.badges.length ? currentUser.badges.map(b => `<span class="badge">${b}</span>`).join('') : 'No badges yet!';
            } else if (target === 'sessions') {
                updateSessionOverview();
            }
        }
        sidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

    // Dark Mode Toggle
const toggleDarkMode = document.getElementById('toggle-dark-mode');
if (toggleDarkMode) {
    toggleDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
}

    // Notification System (Frontend placeholder)
    function updateNotifications() {
        if (!notifications) return;
        notifications.innerHTML = '';
        if (!currentUser || !currentUser.sessions) {
            notifications.innerHTML = '<div class="mentor-item">No notifications yet.</div>';
            return;
        }
        currentUser.sessions.forEach(session => {
            if (session.status === 'pending') {
                const div = document.createElement('div');
                div.textContent = `Pending session with ${session.mentor} on ${session.date}.`;
                div.className = 'mentor-item';
                notifications.appendChild(div);
            } else if (session.status === 'accepted') {
                const div = document.createElement('div');
                div.textContent = `Session with ${session.mentor} on ${session.date} has been accepted!`;
                div.className = 'mentor-item';
                notifications.appendChild(div);
            }
        });
        if (!notifications.innerHTML) notifications.innerHTML = '<div class="mentor-item">No notifications yet.</div>';
    }

    // Simulate mentor acceptance (to be replaced with backend)
    setTimeout(() => {
        if (currentUser && currentUser.sessions) {
            currentUser.sessions.forEach(session => {
                if (session.status === 'pending' && Math.random() > 0.3) {
                    session.status = 'accepted';
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    updateNotifications();
                }
            });
        }
    }, 5000);

    // Session Overview
    function updateSessionOverview() {
        if (!sessionOverview) return;
        sessionOverview.innerHTML = '';
        if (!currentUser || !currentUser.sessions) {
            sessionOverview.innerHTML = '<div class="mentor-item">No sessions booked yet.</div>';
            return;
        }
        currentUser.sessions.forEach(session => {
            const div = document.createElement('div');
            div.textContent = `${session.status === 'pending' ? 'Pending' : 'Accepted'} session with ${session.mentor} on ${session.date}${session.notes ? ` - Notes: ${session.notes}` : ''}`;
            div.className = 'schedule-item';
            sessionOverview.appendChild(div);
        });
    }

    // Community Forum Functionality
    const postInput = document.getElementById('post-input');
    const postSubmit = document.getElementById('post-submit');
    const postList = document.getElementById('post-list');

    if (postInput && postSubmit && postList) {
        postSubmit.addEventListener('click', () => {
            if (postInput.value && currentUser) {
                const div = document.createElement('div');
                div.textContent = `${currentUser.username}: ${postInput.value} (Posted: ${new Date().toLocaleString()})`;
                div.className = 'post';
                postList.appendChild(div);
                postInput.value = '';
            }
        });
    }

    // Resources and Career Placeholder
    const resumeUpload = document.getElementById('resume-upload');
    const scheduleMock = document.getElementById('schedule-mock');

    if (resumeUpload) {
        resumeUpload.addEventListener('change', () => {
            alert('Resume uploaded! (Placeholder - Backend integration needed)');
        });
    }

    if (scheduleMock) {
        scheduleMock.addEventListener('click', () => {
            alert('Mock interview scheduled! (Placeholder - Backend integration needed)');
        });
    }
}

// Profile Section Initialization
const profileSection = document.getElementById('profile');
if (profileSection) {
    document.getElementById('profile-name').value = currentUser ? currentUser.firstName + ' ' + currentUser.lastName : '';
    document.getElementById('profile-email').value = currentUser ? currentUser.email : '';
    document.getElementById('profile-role').value = currentUser ? currentUser.role : '';
    const badgesDisplay = document.querySelector('#profile-badges .badges-display');
    badgesDisplay.innerHTML = currentUser && currentUser.badges.length ? currentUser.badges.map(b => `<span class="badge">${b}</span>`).join(' ') : 'No badges yet!';
}

// ===== GLOBAL VARIABLES =====
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// ===== HAMBURGER MENU FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navBtn = document.querySelector('.nav-btn');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        if (navBtn) {
            navBtn.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// ===== PASSWORD TOGGLE FUNCTIONALITY =====
function togglePasswordVisibility(passwordField, toggleIcon) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Registration page password toggle
function togglePassword() {
    const password = document.getElementById('password');
    const toggle = document.querySelector('.register-toggle-password');
    if (password && toggle) {
        togglePasswordVisibility(password, toggle);
    }
}

// Login page password toggle
function toggleLoginPassword() {
    const password = document.getElementById('login-password');
    const toggle = document.getElementById('toggleLoginPassword');
    if (password && toggle) {
        togglePasswordVisibility(password, toggle);
    }
}

// Initialize password toggles
document.addEventListener('DOMContentLoaded', function() {
    const passwordToggle = document.getElementById('togglePassword');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePassword);
    }

    const loginToggle = document.getElementById('toggleLoginPassword');
    if (loginToggle) {
        loginToggle.addEventListener('click', toggleLoginPassword);
    }
});

// ===== REGISTRATION FUNCTIONALITY =====
const authForm = document.getElementById('auth-form');
const authMessage = document.getElementById('auth-message');

// Multi-step form variables
let currentStep = 1;
let selectedRole = null;
let selectedGoal = null;
let selectedEducation = null;
let professionalInfo = {};

if (authForm) {
    // Initialize form steps
    function initializeFormSteps() {
        const steps = document.querySelectorAll('.register-form-step');
        steps.forEach(step => {
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        updateStepIndicator();
        updateAllButtonStates();
    }

    function updateStepIndicator() {
        const indicator = document.querySelector('.register-step-indicator');
        if (indicator) {
            indicator.textContent = `Step ${currentStep} of 3`;
        }
    }

    function validateCurrentStep() {
        switch(currentStep) {
            case 1:
                return validateStep1();
            case 2:
                return validateStep2();
            case 3:
                return validateStep3();
            default:
                return true;
        }
    }

    function validateStep1() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const username = document.getElementById('username').value.trim();
        
        const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Clear previous errors
        document.querySelectorAll('.register-input-group').forEach(group => {
            group.classList.remove('invalid');
        });

        let isValid = true;

        if (!firstName) {
            document.getElementById('firstName').parentElement.classList.add('invalid');
            isValid = false;
        }
        if (!lastName) {
            document.getElementById('lastName').parentElement.classList.add('invalid');
            isValid = false;
        }
        if (!email || !isValidEmail) {
            document.getElementById('email').parentElement.classList.add('invalid');
            isValid = false;
        }
        if (!password || !isValidPassword) {
            document.getElementById('password').parentElement.classList.add('invalid');
            isValid = false;
        }
        if (!selectedRole) {
            document.querySelector('.register-role-options').parentElement.classList.add('invalid');
            isValid = false;
        }
        if (!username) {
            document.getElementById('username').parentElement.classList.add('invalid');
            isValid = false;
        }

        return isValid;
    }

    function validateStep2() {
        if (selectedRole === 'mentee') {
            if (!selectedGoal) {
                showAuthMessage('Please select a career goal before continuing', 'error');
                return false;
            }
        } else if (selectedRole === 'mentor') {
            const currentJob = document.getElementById('currentJob').value.trim();
            const yearsExperience = document.getElementById('yearsExperience').value.trim();
            
            if (!currentJob) {
                document.getElementById('currentJob').parentElement.classList.add('invalid');
                showAuthMessage('Please enter your current position', 'error');
                return false;
            }
            if (!yearsExperience) {
                document.getElementById('yearsExperience').parentElement.classList.add('invalid');
                showAuthMessage('Please enter your years of experience', 'error');
                return false;
            }
        }
        return true;
    }

    function validateStep3() {
        if (!selectedEducation) {
            showAuthMessage('Please select your education level', 'error');
            return false;
        }
        return true;
    }

    function showAuthMessage(message, type = 'error') {
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = `register-auth-message ${type}`;
            authMessage.style.display = 'block';
            
            setTimeout(() => {
                authMessage.style.display = 'none';
            }, 5000);
        }
    }

    function navigateToStep(step) {
        if (step < 1 || step > 3) return;
        
        if (step > currentStep && !validateCurrentStep()) {
            return;
        }

        currentStep = step;
        updateStepContent();
        initializeFormSteps();
    }

    function updateStepContent() {
        document.querySelectorAll('.register-form-step').forEach(step => {
            step.style.display = 'none';
        });

        const currentStepElement = document.querySelector(`.register-form-step[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        if (currentStep === 2) {
            const stepHeader = document.querySelector('.register-form-step[data-step="2"] .register-step-header h3');
            if (stepHeader) {
                if (selectedRole === 'mentee') {
                    stepHeader.textContent = 'Career Goals';
                    document.querySelector('.register-goals-grid').style.display = 'grid';
                    document.querySelector('.mentor-professional-fields').style.display = 'none';
                } else {
                    stepHeader.textContent = 'Professional Background';
                    document.querySelector('.register-goals-grid').style.display = 'none';
                    document.querySelector('.mentor-professional-fields').style.display = 'block';
                }
            }
        }
    }

    function updateAllButtonStates() {
        if (currentStep === 1) {
            const continueBtn = document.querySelector('.register-next-btn[data-next="2"]');
            if (continueBtn) {
                continueBtn.disabled = !validateStep1();
            }
        }
        updateRegisterButton();
    }

    function updateRegisterButton() {
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            if (currentStep === 3) {
                registerBtn.style.display = 'inline-flex';
                registerBtn.disabled = !validateStep3();
            } else {
                registerBtn.style.display = 'none';
            }
        }
    }

    function updatePasswordFeedback() {
        const password = document.getElementById('password').value;
        const feedback = document.getElementById('password-feedback');
        
        if (!password) {
            feedback.style.display = 'none';
            return;
        }

        const checks = [
            { text: 'Minimum of 8 characters', test: (p) => p.length >= 8 },
            { text: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
            { text: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
            { text: 'One number', test: (p) => /\d/.test(p) },
            { text: 'One special character', test: (p) => /[!@#$%^&*]/.test(p) }
        ];

        const allValid = checks.every(check => check.test(password));
        
        if (allValid) {
            feedback.style.display = 'none';
        } else {
            feedback.style.display = 'block';
            feedback.innerHTML = checks.map(check => 
                `<span class="${check.test(password) ? 'valid' : 'invalid'}">${check.text}</span>`
            ).join('');
        }
    }

    function checkUsernameAvailability(username) {
        const feedback = document.getElementById('username-feedback');
        if (!feedback) return;

        const isValid = /^[a-zA-Z0-9._-]+$/.test(username);
        const isTaken = users.some(u => u.username === username);
        
        feedback.textContent = isValid ? 
            (isTaken ? 'Username taken. Try another.' : 'Username available!') : 
            'Use letters, numbers, ., _ or - only.';
        feedback.style.color = isValid ? (isTaken ? '#e74c3c' : '#2ecc71') : '#e74c3c';
    }

    function generateUsername() {
        const firstName = document.getElementById('firstName').value.trim().toLowerCase();
        const lastName = document.getElementById('lastName').value.trim().toLowerCase();
        
        if (firstName && lastName) {
            const separators = ['_', '-', '.'];
            const randomSep = separators[Math.floor(Math.random() * separators.length)];
            let suggestedUsername = `${firstName}${randomSep}${lastName}`;
            let counter = 1;
            
            while (users.some(u => u.username === suggestedUsername)) {
                suggestedUsername = `${firstName}${randomSep}${lastName}${counter}`;
                counter++;
            }
            
            document.getElementById('username').value = suggestedUsername;
            checkUsernameAvailability(suggestedUsername);
        }
    }

    // Event Listeners
    document.addEventListener('click', function(e) {
        if (e.target.closest('.register-role-card')) {
            const card = e.target.closest('.register-role-card');
            document.querySelectorAll('.register-role-card').forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            selectedRole = card.dataset.role;
            document.getElementById('role').value = selectedRole;
            document.querySelector('.register-role-options').parentElement.classList.remove('invalid');
            updateAllButtonStates();
        }

        if (e.target.closest('.register-goal-card')) {
            const card = e.target.closest('.register-goal-card');
            document.querySelectorAll('.register-goal-card').forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            selectedGoal = card.dataset.goal;
        }

        if (e.target.closest('.register-edu-card')) {
            const card = e.target.closest('.register-edu-card');
            document.querySelectorAll('.register-edu-card').forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            selectedEducation = card.dataset.education;
            updateAllButtonStates();
        }

        if (e.target.closest('.register-next-btn')) {
            const button = e.target.closest('.register-next-btn');
            const nextStep = parseInt(button.dataset.next);
            navigateToStep(nextStep);
        }

        if (e.target.closest('.register-prev-btn')) {
            const button = e.target.closest('.register-prev-btn');
            const prevStep = parseInt(button.dataset.prev);
            navigateToStep(prevStep);
        }
    });

    // Form input validation
    document.getElementById('password')?.addEventListener('input', function() {
        updatePasswordFeedback();
        updateAllButtonStates();
    });

    document.getElementById('username')?.addEventListener('input', function() {
        checkUsernameAvailability(this.value);
        updateAllButtonStates();
    });

    document.getElementById('currentJob')?.addEventListener('input', updateAllButtonStates);
    document.getElementById('yearsExperience')?.addEventListener('input', updateAllButtonStates);

    const formInputs = ['firstName', 'lastName', 'email'];
    formInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateAllButtonStates);
        }
    });

    let usernameTimeout;
    ['firstName', 'lastName'].forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function() {
                clearTimeout(usernameTimeout);
                usernameTimeout = setTimeout(generateUsername, 500);
            });
        }
    });

    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            showAuthMessage('Please complete all required fields', 'error');
            return;
        }

        collectProfessionalInfo();
        completeRegistration();
    });

    function collectProfessionalInfo() {
        professionalInfo = {
            currentJob: document.getElementById('currentJob')?.value.trim() || '',
            yearsExperience: document.getElementById('yearsExperience')?.value.trim() || '',
            education: selectedEducation,
            goal: selectedGoal
        };
    }

    function completeRegistration() {
        const formData = new FormData(authForm);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        const username = formData.get('username');
        const currentJob = professionalInfo.currentJob;
        const yearsExperience = professionalInfo.yearsExperience;

        const userExists = users.some(u => u.username === username || u.email === email);
        if (userExists) {
            showAuthMessage('Username or email already taken. Please choose another.', 'error');
            return;
        }

        const userData = {
            firstName,
            lastName,
            email,
            username,
            password,
            role: selectedRole,
            goal: selectedGoal,
            education: selectedEducation,
            sessions: [],
            badges: [],
            currentJob,
            yearsExperience,
            ...(selectedRole === 'mentor' ? { 
                expertise: [currentJob],
                mentors: []
            } : {
                mentorType: currentJob
            })
        };

        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        showAuthMessage('Account successfully created! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    initializeFormSteps();
    updateStepContent();
}

// ===== LOGIN FUNCTIONALITY =====
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const forgotPassword = document.getElementById('forgot-password');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const identifier = formData.get('identifier');
        const password = formData.get('password');

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
        loginMessage.textContent = 'Password reset link sent! (Placeholder)';
    });
}

// ===== ENHANCED DASHBOARD FUNCTIONALITY =====
if (window.location.pathname.includes('dashboard.html') || document.querySelector('.dashboard-body')) {
    const logout = document.querySelector('.logout');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const headerActions = document.querySelectorAll('.header-btn');
    const notificationBadge = document.querySelector('.notification-badge');
    const actionButtons = document.querySelectorAll('.action-btn');
    const profileBtn = document.querySelector('.profile-btn');

    if (!currentUser) {
        alert('Please log in first!');
        window.location.href = 'login.html';
    }

    // Enhanced dashboard initialization
    function initializeDashboard() {
        updateUserInfo();
        updateNotifications();
        loadDashboardOverview();
        setupProfileButton();
        setupTabButtons();
        setupMentorConnectButtons();

        // Respect URL hash or default to dashboard
        const hash = window.location.hash?.replace('#', '');
        const initial = hash || 'dashboard';
        showDashboardSection(initial);
    }

    // Setup profile button
    function setupProfileButton() {
        if (profileBtn) {
            profileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                navItems.forEach(item => item.classList.remove('active'));
                showDashboardSection('profile');
            });
        }
    }

    // Setup tab buttons
    function setupTabButtons() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                const container = this.closest('.sessions-tabs') || this.closest('.progress-tabs');
                
                if (container) {
                    // Remove active from all buttons and contents in this container
                    const parent = container.parentElement;
                    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    // Add active to clicked button and corresponding content
                    this.classList.add('active');
                    const content = parent.querySelector(`#${tabName}-tab`);
                    if (content) {
                        content.classList.add('active');
                    }
                }
            });
        });
    }

    // Setup mentor connect buttons
    function setupMentorConnectButtons() {
        const connectButtons = document.querySelectorAll('.mentor-action');
        connectButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const mentorName = this.closest('.mentor-card').querySelector('h4').textContent;
                
                if (this.classList.contains('primary')) {
                    // Schedule button
                    showDashboardSection('sessions');
                } else {
                    // Connect button
                    connectWithMentor(mentorName);
                }
            });
        });
    }

    function updateUserInfo() {
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        const userAvatar = document.querySelector('.user-avatar i');
        
        if (currentUser && userName) {
            userName.textContent = `Welcome, ${currentUser.firstName}!`;
            userRole.textContent = currentUser.role === 'mentor' ? 'Mentor' : 'Mentee';
            
            if (userAvatar) {
                userAvatar.className = currentUser.role === 'mentor' ? 'fas fa-user-tie' : 'fas fa-user-graduate';
            }
        }
    }

    // Show specific dashboard section
    function showDashboardSection(section) {
        // Hide all sections first
        document.querySelectorAll('.dashboard-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Toggle dashboard stats visibility
        const stats = document.getElementById('dashboard-stats');
        if (stats) {
            stats.style.display = (section === 'dashboard') ? '' : 'none';
        }

        // Show the target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');

            // Update dashboard title based on section
            const dashboardTitle = document.querySelector('.dashboard-title');
            if (dashboardTitle) {
                const titles = {
                    'dashboard': 'Dashboard Overview',
                    'profile': 'My Profile',
                    'sessions': 'Session Management',
                    'find-mentor': 'Find Mentors',
                    'progress': 'Progress & Notes'
                };
                dashboardTitle.textContent = titles[section] || 'Dashboard';
            }

            // Load section-specific content
            loadSectionContent(section);
        }
    }

    function loadSectionContent(section) {
        switch(section) {
            case 'dashboard':
                loadDashboardOverview();
                break;
            case 'profile':
                loadProfileSection();
                break;
            case 'sessions':
                loadSessionsSection();
                break;
            case 'find-mentor':
                loadMentorSection();
                break;
            case 'progress':
                loadProgressSection();
                break;
        }
    }

    // Load dashboard overview with widgets
    function loadDashboardOverview() {
        loadRecentSessions();
        loadRecommendedMentors();
        updateDashboardStats();
    }

    // Load recent sessions for dashboard
    function loadRecentSessions() {
        const recentSessionsList = document.getElementById('recent-sessions-list');
        if (!recentSessionsList) return;

        if (currentUser.sessions && currentUser.sessions.length > 0) {
            const recentSessions = currentUser.sessions.slice(-3).reverse(); // Show last 3 sessions
            recentSessionsList.innerHTML = recentSessions.map(session => `
                <div class="session-item">
                    <div class="session-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="session-info">
                        <h4>${session.mentor}</h4>
                        <p>${session.topic || 'Career Discussion'}</p>
                        <span class="session-time">${session.date} ${session.time ? 'at ' + session.time : ''}</span>
                    </div>
                    <div class="session-status ${session.status || 'pending'}">${session.status || 'pending'}</div>
                </div>
            `).join('');
        } else {
            recentSessionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <p>No sessions scheduled yet</p>
                    <button class="btn-secondary" onclick="showDashboardSection('sessions')">Schedule Your First Session</button>
                </div>
            `;
        }
    }

    // Load recommended mentors for dashboard
    function loadRecommendedMentors() {
        const recommendedMentors = document.getElementById('recommended-mentors');
        if (!recommendedMentors) return;

        const mentors = users.filter(u => u.role === 'mentor').slice(0, 2); // Show top 2 mentors
        
        if (mentors.length > 0) {
            recommendedMentors.innerHTML = mentors.map(mentor => `
                <div class="mentor-card">
                    <div class="mentor-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="mentor-info">
                        <h4>${mentor.firstName} ${mentor.lastName}</h4>
                        <p>${mentor.currentJob || 'Professional Mentor'}</p>
                        <div class="mentor-rating">
                            <i class="fas fa-star"></i>
                            <span>4.8 (${Math.floor(Math.random() * 50) + 20} reviews)</span>
                        </div>
                    </div>
                    <button class="mentor-action" onclick="connectWithMentor('${mentor.username}')">Connect</button>
                </div>
            `).join('');
        } else {
            recommendedMentors.innerHTML = '<p>No mentors available at the moment.</p>';
        }
    }

    // Update dashboard statistics
    function updateDashboardStats() {
        if (!currentUser) return;

        // Update sessions count
        const sessionsCount = currentUser.sessions ? currentUser.sessions.length : 0;
        const sessionsElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
        if (sessionsElement) {
            sessionsElement.textContent = sessionsCount;
        }

        // Update mentors count
        const mentorsCount = users.filter(u => u.role === 'mentor').length;
        const mentorsElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (mentorsElement) {
            mentorsElement.textContent = mentorsCount;
        }

        // Update progress percentage
        const progressElement = document.querySelector('.stat-card:nth-child(3) .stat-value');
        if (progressElement) {
            progressElement.textContent = calculateOverallProgress() + '%';
        }

        // Update progress bar
        const progressFill = document.querySelector('.stat-card:nth-child(3) .progress-fill');
        if (progressFill) {
            progressFill.style.width = calculateOverallProgress() + '%';
        }
    }

    // Enhanced profile section
    function loadProfileSection() {
        if (!currentUser) return;

        // Update profile information
        const fullnameElement = document.getElementById('profile-fullname');
        const emailElement = document.getElementById('profile-email');
        const usernameElement = document.getElementById('profile-username');
        const roleBadgeElement = document.getElementById('profile-role-badge');
        const goalElement = document.getElementById('profile-goal');
        const educationElement = document.getElementById('profile-education');
        const positionElement = document.getElementById('profile-position');
        const experienceElement = document.getElementById('profile-experience');

        if (fullnameElement) fullnameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        if (emailElement) emailElement.textContent = currentUser.email;
        if (usernameElement) usernameElement.textContent = currentUser.username;
        if (roleBadgeElement) roleBadgeElement.textContent = currentUser.role === 'mentor' ? 'Mentor' : 'Mentee';
        if (goalElement) goalElement.textContent = currentUser.goal ? currentUser.goal.replace('_', ' ') : 'Not set';
        if (educationElement) educationElement.textContent = currentUser.education ? currentUser.education.replace('_', ' ') : 'Not specified';
        if (positionElement) positionElement.textContent = currentUser.currentJob || 'Not specified';
        if (experienceElement) experienceElement.textContent = currentUser.yearsExperience ? `${currentUser.yearsExperience} years` : 'Not specified';

        // Update profile stats
        const sessionsCountElement = document.getElementById('profile-sessions-count');
        const badgesCountElement = document.getElementById('profile-badges-count');
        const progressElement = document.getElementById('profile-progress');

        if (sessionsCountElement) sessionsCountElement.textContent = currentUser.sessions ? currentUser.sessions.length : 0;
        if (badgesCountElement) badgesCountElement.textContent = currentUser.badges ? currentUser.badges.length : 0;
        if (progressElement) progressElement.textContent = calculateOverallProgress() + '%';
    }

    // Enhanced sessions section
    function loadSessionsSection() {
        loadUpcomingSessions();
        loadSessionHistory();
        populateMentorSelect();
        
        // Setup session booking form
        const sessionBookingForm = document.getElementById('session-booking-form');
        if (sessionBookingForm) {
            sessionBookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                bookSession();
            });
        }
    }

    function loadUpcomingSessions() {
        const upcomingSessionsList = document.getElementById('upcoming-sessions-list');
        if (!upcomingSessionsList) return;

        if (currentUser.sessions && currentUser.sessions.length > 0) {
            const upcomingSessions = currentUser.sessions.filter(session => 
                new Date(session.date) >= new Date() || session.status === 'pending'
            );

            if (upcomingSessions.length > 0) {
                upcomingSessionsList.innerHTML = upcomingSessions.map(session => `
                    <div class="session-item">
                        <div class="session-avatar">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="session-info">
                            <h4>${session.mentor}</h4>
                            <p>${session.topic || 'General Discussion'}</p>
                            <span class="session-time">${session.date} ${session.time ? 'at ' + session.time : ''}</span>
                            ${session.notes ? `<p class="session-notes">${session.notes}</p>` : ''}
                        </div>
                        <div class="session-status ${session.status || 'pending'}">${session.status || 'pending'}</div>
                    </div>
                `).join('');
            } else {
                upcomingSessionsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-times"></i>
                        <p>No upcoming sessions</p>
                    </div>
                `;
            }
        } else {
            upcomingSessionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <p>No sessions scheduled yet</p>
                </div>
            `;
        }
    }

    function loadSessionHistory() {
        const sessionHistoryList = document.getElementById('session-history-list');
        if (!sessionHistoryList) return;

        if (currentUser.sessions && currentUser.sessions.length > 0) {
            const pastSessions = currentUser.sessions.filter(session => 
                new Date(session.date) < new Date() || session.status === 'completed'
            );

            if (pastSessions.length > 0) {
                sessionHistoryList.innerHTML = pastSessions.map(session => `
                    <div class="session-item">
                        <div class="session-avatar">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="session-info">
                            <h4>${session.mentor}</h4>
                            <span class="session-time">${session.date}</span>
                        </div>
                        <div class="session-status completed">Completed</div>
                    </div>
                `).join('');
            } else {
                sessionHistoryList.innerHTML = '<p>No session history yet.</p>';
            }
        } else {
            sessionHistoryList.innerHTML = '<p>No session history yet.</p>';
        }
    }

    function populateMentorSelect() {
        const mentorSelect = document.getElementById('mentor-select');
        if (!mentorSelect) return;

        const mentors = users.filter(u => u.role === 'mentor');
        mentorSelect.innerHTML = '<option value="">Choose a mentor...</option>' +
            mentors.map(mentor => `
                <option value="${mentor.username}">
                    ${mentor.firstName} ${mentor.lastName} - ${mentor.currentJob || 'Mentor'}
                </option>
            `).join('');
    }

    function bookSession() {
        const mentorSelect = document.getElementById('mentor-select');
        const sessionDate = document.getElementById('session-date');
        const sessionTime = document.getElementById('session-time');
        const sessionTopic = document.getElementById('session-topic');
        const sessionNotes = document.getElementById('session-notes');

        if (!mentorSelect.value || !sessionDate.value || !sessionTime.value || !sessionTopic.value) {
            alert('Please fill in all required fields.');
            return;
        }

        const newSession = {
            id: Date.now().toString(),
            mentor: mentorSelect.value,
            date: sessionDate.value,
            time: sessionTime.value,
            topic: sessionTopic.value,
            notes: sessionNotes.value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Add to user's sessions
        currentUser.sessions = currentUser.sessions || [];
        currentUser.sessions.push(newSession);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update the mentor's sessions as well
        const mentor = users.find(u => u.username === mentorSelect.value);
        if (mentor) {
            mentor.sessions = mentor.sessions || [];
            mentor.sessions.push({
                student: currentUser.username,
                date: sessionDate.value,
                time: sessionTime.value,
                topic: sessionTopic.value,
                status: 'pending'
            });
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Reset form and show success
        document.getElementById('session-booking-form').reset();
        alert('Session scheduled successfully! The mentor will review your request.');

        // Update UI
        loadUpcomingSessions();
        updateDashboardStats();
        updateNotifications();

        // Earn badge for first session
        if (currentUser.badges && currentUser.badges.indexOf('First Session') === -1) {
            currentUser.badges.push('First Session');
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert('Congratulations! You earned the "First Session" badge!');
        }
    }

    // Enhanced find mentors section
    function loadMentorSection() {
        loadAllMentors();
        setupMentorSearch();
    }

    function loadAllMentors() {
        const mentorsGrid = document.getElementById('mentors-grid');
        if (!mentorsGrid) return;

        const mentors = users.filter(u => u.role === 'mentor');
        
        if (mentors.length > 0) {
            mentorsGrid.innerHTML = mentors.map(mentor => `
                <div class="mentor-card expanded">
                    <div class="mentor-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="mentor-info">
                        <h4>${mentor.firstName} ${mentor.lastName}</h4>
                        <p class="mentor-title">${mentor.currentJob || 'Professional Mentor'}</p>
                        <div class="mentor-details">
                            <span class="detail"><i class="fas fa-briefcase"></i> ${mentor.yearsExperience || '5+'} years experience</span>
                            <span class="detail"><i class="fas fa-graduation-cap"></i> ${mentor.education ? mentor.education.replace('_', ' ') : 'Professional'}</span>
                        </div>
                        <div class="mentor-expertise">
                            <strong>Expertise:</strong> ${mentor.expertise ? mentor.expertise.join(', ') : 'Career Coaching'}
                        </div>
                    </div>
                    <div class="mentor-actions">
                        <button class="mentor-action primary" onclick="scheduleWithMentor('${mentor.username}')">
                            <i class="fas fa-calendar-plus"></i> Schedule
                        </button>
                        <button class="mentor-action secondary" onclick="connectWithMentor('${mentor.username}')">
                            <i class="fas fa-user-plus"></i> Connect
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            mentorsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No mentors available at the moment</p>
                </div>
            `;
        }
    }

    function setupMentorSearch() {
        const searchInput = document.getElementById('mentor-search-input');
        const filterTabs = document.querySelectorAll('.filter-tab');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const mentorCards = document.querySelectorAll('.mentor-card.expanded');
                
                mentorCards.forEach(card => {
                    const mentorName = card.querySelector('h4').textContent.toLowerCase();
                    const mentorTitle = card.querySelector('.mentor-title').textContent.toLowerCase();
                    const mentorExpertise = card.querySelector('.mentor-expertise').textContent.toLowerCase();
                    
                    const matches = mentorName.includes(searchTerm) || 
                                  mentorTitle.includes(searchTerm) || 
                                  mentorExpertise.includes(searchTerm);
                    
                    card.style.display = matches ? 'flex' : 'none';
                });
            });
        }

        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                // Filter functionality would go here
            });
        });
    }

    // Enhanced progress section
    function loadProgressSection() {
        loadUserBadges();
        setupNotesForm();
        loadSavedNotes();
    }

    function loadUserBadges() {
        const userBadges = document.getElementById('user-badges');
        if (!userBadges) return;

        if (currentUser.badges && currentUser.badges.length > 0) {
            userBadges.innerHTML = currentUser.badges.map(badge => `
                <div class="badge-item">
                    <i class="fas fa-trophy"></i>
                    <span>${badge}</span>
                </div>
            `).join('');
        } else {
            userBadges.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-award"></i>
                    <p>No badges earned yet</p>
                </div>
            `;
        }
    }

    function setupNotesForm() {
        const notesForm = document.getElementById('progress-notes-form');
        if (notesForm) {
            notesForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveProgressNote();
            });
        }

        const clearButton = document.getElementById('clear-notes');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                document.getElementById('note-title').value = '';
                document.getElementById('note-content').value = '';
                document.getElementById('note-tags').value = '';
            });
        }
    }

    function saveProgressNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const tags = document.getElementById('note-tags').value.trim();

        if (!title || !content) {
            alert('Please add a title and content for your note.');
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            title: title,
            content: content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            date: new Date().toLocaleString(),
            type: 'progress'
        };

        // Save to user's notes
        currentUser.notes = currentUser.notes || [];
        currentUser.notes.unshift(newNote);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Clear form and refresh notes list
        document.getElementById('progress-notes-form').reset();
        loadSavedNotes();
        
        alert('Note saved successfully!');
        
        // Earn badge for note taking
        if (currentUser.badges && currentUser.badges.indexOf('Note Taker') === -1) {
            currentUser.badges.push('Note Taker');
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert('Congratulations! You earned the "Note Taker" badge!');
        }
    }

    function loadSavedNotes() {
        const notesList = document.getElementById('notes-list');
        if (!notesList) return;

        if (currentUser.notes && currentUser.notes.length > 0) {
            const recentNotes = currentUser.notes.slice(0, 3); // Show last 3 notes
            notesList.innerHTML = recentNotes.map(note => `
                <div class="note-item">
                    <div class="note-header">
                        <h5>${note.title}</h5>
                        <span class="note-date">${note.date}</span>
                    </div>
                    <p class="note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                </div>
            `).join('');
        } else {
            notesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <p>No notes yet</p>
                </div>
            `;
        }
    }

    // Global helper functions
    window.connectWithMentor = function(mentorUsername) {
        alert(`Connection request sent to ${mentorUsername}! They will review your request.`);
    }

    window.scheduleWithMentor = function(mentorUsername) {
        showDashboardSection('sessions');
        // Auto-select the mentor in the form
        setTimeout(() => {
            const mentorSelect = document.getElementById('mentor-select');
            if (mentorSelect) {
                mentorSelect.value = mentorUsername;
            }
        }, 100);
    }

    function calculateOverallProgress() {
        if (!currentUser.sessions) return 0;
        const completedSessions = currentUser.sessions.filter(s => s.status === 'completed').length;
        const totalSessions = currentUser.sessions.length;
        return totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    }

    function updateNotifications() {
        if (!notificationBadge) return;
        
        if (currentUser && currentUser.sessions) {
            const pendingSessions = currentUser.sessions.filter(s => s.status === 'pending').length;
            notificationBadge.textContent = pendingSessions > 0 ? pendingSessions : '';
            notificationBadge.style.display = pendingSessions > 0 ? 'flex' : 'none';
        }
    }

    // Sidebar toggle functionality
    if (sidebarToggle && dashboardSidebar) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('active');
            document.body.style.overflow = dashboardSidebar.classList.contains('active') ? 'hidden' : 'auto';
        });

        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024 && 
                !dashboardSidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) && 
                dashboardSidebar.classList.contains('active')) {
                dashboardSidebar.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Navigation functionality
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.querySelector('a').getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    
                    navItems.forEach(navItem => navItem.classList.remove('active'));
                    this.classList.add('active');
                    
                    const target = this.querySelector('a').getAttribute('href').substring(1);
                    showDashboardSection(target);
                }
                
                if (window.innerWidth <= 1024) {
                    dashboardSidebar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }

    // Logout functionality
    if (logout) {
        logout.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }

    // Header actions
    headerActions.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.querySelector('.fa-bell')) {
                alert('Notifications feature coming soon!');
            } else if (this.querySelector('.fa-cog')) {
                alert('Settings feature coming soon!');
            }
        });
    });

    // Quick Actions functionality
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            switch(action) {
                case 'find-mentor':
                    showDashboardSection('find-mentor');
                    break;
                case 'schedule-session':
                    showDashboardSection('sessions');
                    break;
                case 'resources':
                    window.location.href = 'resources.html';
                    break;
                case 'progress':
                    showDashboardSection('progress');
                    break;
            }
        });
    });

    // Initialize enhanced dashboard
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}

// ===== CAREER PAGE FUNCTIONALITY =====
if (window.location.pathname.includes('career.html') || document.querySelector('.career-grid')) {
    const resumeUpload = document.getElementById('resume-upload');
    const scheduleMock = document.getElementById('schedule-mock');
    const serviceButtons = document.querySelectorAll('.service-btn');

    if (resumeUpload) {
        resumeUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size too large. Please upload a file smaller than 5MB.');
                    this.value = '';
                    return;
                }
                
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Please upload a PDF or Word document.');
                    this.value = '';
                    return;
                }
                
                alert('Resume uploaded successfully! Our team will review it and provide feedback within 48 hours.');
                
                if (currentUser && currentUser.badges && currentUser.badges.indexOf('Resume Ready') === -1) {
                    currentUser.badges.push('Resume Ready');
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    alert('Congratulations! You earned the "Resume Ready" badge!');
                }
            }
        });
    }

    if (scheduleMock) {
        scheduleMock.addEventListener('click', function() {
            if (!currentUser) {
                alert('Please log in to schedule a mock interview.');
                window.location.href = 'login.html';
                return;
            }
            
            alert('Mock interview scheduling feature activated! You will be redirected to our scheduling system.');
        });
    }

    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.querySelector('span').textContent;
            switch(service) {
                case 'Explore Opportunities':
                    alert('Opening job opportunities portal...');
                    break;
                case 'Plan My Path':
                    if (!currentUser) {
                        alert('Please log in to access career planning.');
                        window.location.href = 'login.html';
                        return;
                    }
                    alert('Career strategy planning session scheduled! A mentor will contact you soon.');
                    break;
                case 'View Events':
                    alert('Loading upcoming networking events...');
                    break;
                case 'Get Certified':
                    alert('Opening certification programs...');
                    break;
                default:
                    break;
            }
        });
    });
}

// ===== COMMUNITY PAGE FUNCTIONALITY =====
if (window.location.pathname.includes('community.html') || document.querySelector('.community-layout')) {
    const postInput = document.getElementById('post-input');
    const postSubmit = document.getElementById('post-submit');
    const postList = document.getElementById('post-list');
    const categoryItems = document.querySelectorAll('.category-item');
    const filterSelect = document.querySelector('.filter-select');

    let posts = JSON.parse(localStorage.getItem('communityPosts')) || [];

    function loadPosts() {
        if (!postList) return;
        
        if (posts.length === 0) {
            postList.innerHTML = `
                <div class="post-placeholder">
                    <i class="fas fa-comments"></i>
                    <p>Be the first to start a discussion!</p>
                </div>
            `;
            return;
        }

        postList.innerHTML = posts.map(post => `
            <div class="post-item">
                <div class="post-header">
                    <div class="user-avatar small">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="post-meta">
                        <span class="post-author">${post.author}</span>
                        <span class="post-time">${post.timestamp}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                <div class="post-actions">
                    <button class="post-action like-btn" data-post="${post.id}">
                        <i class="far fa-thumbs-up"></i>
                        <span>${post.likes || 0}</span>
                    </button>
                    <button class="post-action comment-btn">
                        <i class="far fa-comment"></i>
                        <span>Comment</span>
                    </button>
                    <button class="post-action share-btn">
                        <i class="far fa-share-square"></i>
                        <span>Share</span>
                    </button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.getAttribute('data-post');
                likePost(postId);
            });
        });
    }

    if (postSubmit && postInput) {
        postSubmit.addEventListener('click', function() {
            if (!currentUser) {
                alert('Please log in to post in the community.');
                window.location.href = 'login.html';
                return;
            }

            const content = postInput.value.trim();
            if (!content) {
                alert('Please write something before posting.');
                return;
            }

            const newPost = {
                id: Date.now().toString(),
                author: currentUser.username,
                content: content,
                timestamp: new Date().toLocaleString(),
                likes: 0,
                comments: []
            };

            posts.unshift(newPost);
            localStorage.setItem('communityPosts', JSON.stringify(posts));
            
            postInput.value = '';
            loadPosts();
            
            if (currentUser.badges && currentUser.badges.indexOf('Community Contributor') === -1) {
                currentUser.badges.push('Community Contributor');
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                alert('Congratulations! You earned the "Community Contributor" badge!');
            }
            
            alert('Post published successfully!');
        });
    }

    function likePost(postId) {
        if (!currentUser) {
            alert('Please log in to like posts.');
            return;
        }

        const post = posts.find(p => p.id === postId);
        if (post) {
            post.likes = (post.likes || 0) + 1;
            localStorage.setItem('communityPosts', JSON.stringify(posts));
            loadPosts();
        }
    }

    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            alert(`Filtering by ${this.querySelector('span').textContent} category`);
        });
    });

    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const sortBy = this.value;
            alert(`Sorting posts by: ${sortBy}`);
        });
    }

    loadPosts();
}

// ===== RESOURCES PAGE FUNCTIONALITY =====
if (window.location.pathname.includes('resources.html') || document.querySelector('.resource-grid')) {
    const searchInput = document.querySelector('.search-input');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const resourceCards = document.querySelectorAll('.resource-card');
    const resourceButtons = document.querySelectorAll('.resource-btn');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            resourceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const matches = title.includes(searchTerm) || description.includes(searchTerm);
                card.style.display = matches ? 'block' : 'none';
            });
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent;
            
            resourceCards.forEach(card => {
                if (filter === 'All Resources') {
                    card.style.display = 'block';
                } else {
                    const category = card.querySelector('h3').textContent;
                    const matches = category.includes(filter);
                    card.style.display = matches ? 'block' : 'none';
                }
            });
        });
    });

    resourceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceTitle = this.closest('.resource-card').querySelector('h3').textContent;
            
            if (!currentUser) {
                alert('Please log in to access learning resources.');
                window.location.href = 'login.html';
                return;
            }
            
            alert(`Starting learning path: ${resourceTitle}`);
            
            if (currentUser) {
                currentUser.accessedResources = currentUser.accessedResources || [];
                if (!currentUser.accessedResources.includes(resourceTitle)) {
                    currentUser.accessedResources.push(resourceTitle);
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                
                if (currentUser.badges && currentUser.badges.indexOf('Lifelong Learner') === -1) {
                    currentUser.badges.push('Lifelong Learner');
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    alert('Congratulations! You earned the "Lifelong Learner" badge!');
                }
            }
        });
    });

    function trackResourceProgress() {
        if (!currentUser || !currentUser.accessedResources) return;
        
        const progressItems = document.querySelectorAll('.progress-item');
        progressItems.forEach(item => {
            const resourceName = item.querySelector('h4').textContent;
            if (currentUser.accessedResources.includes(resourceName)) {
                item.classList.add('completed');
            }
        });
    }

    trackResourceProgress();
}

// ===== DARK MODE TOGGLE =====
const toggleDarkMode = document.getElementById('toggle-dark-mode');
if (toggleDarkMode) {
    toggleDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
}
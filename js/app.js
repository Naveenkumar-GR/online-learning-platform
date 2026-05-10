// LearnHub Frontend Application
class LearnHubApp {
    constructor() {
        this.apiBase = '/api'; // Proxied to backend
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
        this.navigateTo('home');
    }

    loadUserFromStorage() {
        const userData = localStorage.getItem('learnhub_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateNavigation();
        }
    }

    saveUserToStorage(user) {
        this.currentUser = user;
        localStorage.setItem('learnhub_user', JSON.stringify(user));
        this.updateNavigation();
    }

    updateNavigation() {
        const dashboardLink = document.getElementById('dashboard-link');
        if (this.currentUser) {
            dashboardLink.style.display = 'inline';
        } else {
            dashboardLink.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.navigateTo(event.state.page, false);
            }
        });
    }

    navigateTo(page, updateHistory = true) {
        // Update URL without page reload
        if (updateHistory) {
            history.pushState({ page }, '', `#${page}`);
        }

        this.loadPage(page);
    }

    async loadPage(page) {
        const mainContent = document.getElementById('main-content');

        try {
            let content = '';

            switch (page) {
                case 'home':
                    content = this.getHomeContent();
                    break;
                case 'courses':
                    content = await this.getCoursesContent();
                    break;
                case 'course-detail':
                    const courseId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                    content = await this.getCourseDetailContent(courseId);
                    break;
                case 'login':
                    content = this.getLoginContent();
                    break;
                case 'dashboard':
                    content = await this.getDashboardContent();
                    break;
                default:
                    content = this.getHomeContent();
            }

            mainContent.innerHTML = content;
            this.setupPageSpecificListeners(page);
        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = '<div class="error">Error loading page. Please try again.</div>';
        }
    }

    getHomeContent() {
        return `
            <section class="hero">
                <h2>Welcome to LearnHub</h2>
                <p>Online Learning Platform for Full Stack Development</p>
                <button onclick="app.navigateTo('courses')">Explore Courses</button>
            </section>
        `;
    }

    async getCoursesContent() {
        try {
            const response = await fetch(`${this.apiBase}/courses`);
            const courses = await response.json();
            return this.renderCourses(courses);
        } catch (error) {
            console.error('Error loading courses:', error);
            // Fallback to sample data
            const sampleCourses = [
                { id: 1, title: 'Java Full Stack', description: 'Spring Boot + MySQL', duration: 40, instructor: 'John Doe' },
                { id: 2, title: 'Frontend Development', description: 'HTML CSS JavaScript', duration: 30, instructor: 'Jane Smith' },
                { id: 3, title: 'Python Programming', description: 'Python Basics to Advanced', duration: 35, instructor: 'Bob Johnson' }
            ];
            return this.renderCourses(sampleCourses);
        }
    }

    renderCourses(courses) {
        return `
            <h1 style="text-align: center; margin: 40px 0; color: #1e3a8a;">Available Courses</h1>
            <div class="course-container">
                ${courses.map(course => `
                    <div class="course-card">
                        <h2>${course.title}</h2>
                        <p>${course.description}</p>
                        <p><strong>Duration:</strong> ${course.duration} hours</p>
                        <p><strong>Instructor:</strong> ${course.instructor}</p>
                        <button onclick="app.viewCourseDetail(${course.id})">View Details</button>
                        <button onclick="app.enroll(${course.id})" style="margin-top: 10px;">Enroll</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async getCourseDetailContent(courseId) {
        try {
            const response = await fetch(`${this.apiBase}/courses/${courseId}`);
            const course = await response.json();
            return `
                <div class="course-detail">
                    <h1>${course.title}</h1>
                    <p><strong>Description:</strong> ${course.description}</p>
                    <p><strong>Duration:</strong> ${course.duration} hours</p>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <button onclick="app.enroll(${course.id})" style="background: #16a34a; margin-top: 20px;">Enroll Now</button>
                    <button onclick="app.navigateTo('courses')" style="background: #6b7280; margin-top: 20px; margin-left: 10px;">Back to Courses</button>
                </div>
            `;
        } catch (error) {
            return '<div class="course-detail"><h1>Course Not Found</h1><p>The requested course could not be found.</p></div>';
        }
    }

    getLoginContent() {
        return `
            <div class="login-box">
                <h2>Login</h2>
                <form id="login-form">
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="password" id="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                <div class="register-link">
                    <p>Don't have an account? <a href="#" onclick="app.showRegister()">Register here</a></p>
                </div>
            </div>
        `;
    }

    async getDashboardContent() {
        if (!this.currentUser) {
            return '<div class="dashboard"><h1>Please login to view your dashboard</h1></div>';
        }

        try {
            const response = await fetch(`${this.apiBase}/enrollments/user/${this.currentUser.id}`);
            // For now, use local storage as the backend returns HTML
            return this.getLocalDashboardContent();
        } catch (error) {
            return this.getLocalDashboardContent();
        }
    }

    getLocalDashboardContent() {
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');

        if (enrolledCourses.length === 0) {
            return `
                <div class="dashboard">
                    <h1>My Dashboard</h1>
                    <p>You haven't enrolled in any courses yet.</p>
                    <button onclick="app.navigateTo('courses')">Browse Courses</button>
                </div>
            `;
        }

        const enrolledContent = enrolledCourses.map(courseId => {
            const progress = courseProgress[courseId] || 0;
            return `
                <div class="enrollment-card">
                    <h3>Course ${courseId}</h3>
                    <p>Progress: ${progress}%</p>
                    <progress value="${progress}" max="100"></progress>
                    <button onclick="app.completeLesson(${courseId})" style="margin-top: 10px;">Complete Lesson</button>
                </div>
            `;
        }).join('');

        return `
            <div class="dashboard">
                <h1>My Dashboard</h1>
                <h2>My Enrolled Courses</h2>
                ${enrolledContent}
            </div>
        `;
    }

    setupPageSpecificListeners(page) {
        switch (page) {
            case 'login':
                this.setupLoginListeners();
                break;
        }
    }

    setupLoginListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${this.apiBase}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            });

            const result = await response.text();
            if (result === 'Login successful') {
                // Mock user data - in real app, get from response
                this.saveUserToStorage({ id: 1, email, name: 'Test User' });
                alert('Login successful!');
                this.navigateTo('dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Mock login for development
            if (email && password) {
                this.saveUserToStorage({ id: 1, email, name: 'Test User' });
                alert('Login successful (mock)!');
                this.navigateTo('dashboard');
            } else {
                alert('Please enter credentials');
            }
        }
    }

    async enroll(courseId) {
        if (!this.currentUser) {
            alert('Please login to enroll in courses');
            this.navigateTo('login');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/enrollments/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `userId=${this.currentUser.id}&courseId=${courseId}`
            });

            const result = await response.text();
            alert(result);

            // Update local storage
            let enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            if (!enrolled.includes(courseId)) {
                enrolled.push(courseId);
                localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            // Fallback to local storage
            let enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            if (!enrolled.includes(courseId)) {
                enrolled.push(courseId);
                localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
                alert('Enrolled (local storage)');
            }
        }
    }

    completeLesson(courseId) {
        let progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        progress[courseId] = (progress[courseId] || 0) + 10;
        if (progress[courseId] > 100) progress[courseId] = 100;
        localStorage.setItem('courseProgress', JSON.stringify(progress));

        // Update progress on backend if available
        if (this.currentUser) {
            fetch(`${this.apiBase}/enrollments/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `userId=${this.currentUser.id}&courseId=${courseId}&progress=${progress[courseId]}`
            }).catch(error => console.error('Progress update error:', error));
        }

        this.loadPage('dashboard');
    }

    viewCourseDetail(courseId) {
        history.pushState({ page: 'course-detail' }, '', `#course-detail?id=${courseId}`);
        this.loadPage('course-detail');
    }

    showRegister() {
        // For now, just show an alert. In a real app, show registration form
        alert('Registration feature coming soon!');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('learnhub_user');
        this.updateNavigation();
        this.navigateTo('home');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LearnHubApp();
});
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();class i{constructor(){this.apiBase="/api",this.currentUser=null,this.init()}init(){this.loadUserFromStorage(),this.setupEventListeners(),this.navigateTo("home")}loadUserFromStorage(){const e=localStorage.getItem("learnhub_user");e&&(this.currentUser=JSON.parse(e),this.updateNavigation())}saveUserToStorage(e){this.currentUser=e,localStorage.setItem("learnhub_user",JSON.stringify(e)),this.updateNavigation()}updateNavigation(){const e=document.getElementById("dashboard-link");this.currentUser?e.style.display="inline":e.style.display="none"}setupEventListeners(){window.addEventListener("popstate",e=>{e.state&&e.state.page&&this.navigateTo(e.state.page,!1)})}navigateTo(e,t=!0){t&&history.pushState({page:e},"",`#${e}`),this.loadPage(e)}async loadPage(e){const t=document.getElementById("main-content");try{let r="";switch(e){case"home":r=this.getHomeContent();break;case"courses":r=await this.getCoursesContent();break;case"course-detail":const o=new URLSearchParams(window.location.hash.split("?")[1]).get("id");r=await this.getCourseDetailContent(o);break;case"login":r=this.getLoginContent();break;case"dashboard":r=await this.getDashboardContent();break;default:r=this.getHomeContent()}t.innerHTML=r,this.setupPageSpecificListeners(e)}catch(r){console.error("Error loading page:",r),t.innerHTML='<div class="error">Error loading page. Please try again.</div>'}}getHomeContent(){return`
            <section class="hero">
                <h2>Welcome to LearnHub</h2>
                <p>Online Learning Platform for Full Stack Development</p>
                <button onclick="app.navigateTo('courses')">Explore Courses</button>
            </section>
        `}async getCoursesContent(){try{const t=await(await fetch(`${this.apiBase}/courses`)).json();return this.renderCourses(t)}catch(e){console.error("Error loading courses:",e);const t=[{id:1,title:"Java Full Stack",description:"Spring Boot + MySQL",duration:40,instructor:"John Doe"},{id:2,title:"Frontend Development",description:"HTML CSS JavaScript",duration:30,instructor:"Jane Smith"},{id:3,title:"Python Programming",description:"Python Basics to Advanced",duration:35,instructor:"Bob Johnson"}];return this.renderCourses(t)}}renderCourses(e){return`
            <h1 style="text-align: center; margin: 40px 0; color: #1e3a8a;">Available Courses</h1>
            <div class="course-container">
                ${e.map(t=>`
                    <div class="course-card">
                        <h2>${t.title}</h2>
                        <p>${t.description}</p>
                        <p><strong>Duration:</strong> ${t.duration} hours</p>
                        <p><strong>Instructor:</strong> ${t.instructor}</p>
                        <button onclick="app.viewCourseDetail(${t.id})">View Details</button>
                        <button onclick="app.enroll(${t.id})" style="margin-top: 10px;">Enroll</button>
                    </div>
                `).join("")}
            </div>
        `}async getCourseDetailContent(e){try{const r=await(await fetch(`${this.apiBase}/courses/${e}`)).json();return`
                <div class="course-detail">
                    <h1>${r.title}</h1>
                    <p><strong>Description:</strong> ${r.description}</p>
                    <p><strong>Duration:</strong> ${r.duration} hours</p>
                    <p><strong>Instructor:</strong> ${r.instructor}</p>
                    <button onclick="app.enroll(${r.id})" style="background: #16a34a; margin-top: 20px;">Enroll Now</button>
                    <button onclick="app.navigateTo('courses')" style="background: #6b7280; margin-top: 20px; margin-left: 10px;">Back to Courses</button>
                </div>
            `}catch{return'<div class="course-detail"><h1>Course Not Found</h1><p>The requested course could not be found.</p></div>'}}getLoginContent(){return`
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
        `}async getDashboardContent(){if(!this.currentUser)return'<div class="dashboard"><h1>Please login to view your dashboard</h1></div>';try{const e=await fetch(`${this.apiBase}/enrollments/user/${this.currentUser.id}`);return this.getLocalDashboardContent()}catch{return this.getLocalDashboardContent()}}getLocalDashboardContent(){const e=JSON.parse(localStorage.getItem("enrolledCourses")||"[]"),t=JSON.parse(localStorage.getItem("courseProgress")||"{}");return e.length===0?`
                <div class="dashboard">
                    <h1>My Dashboard</h1>
                    <p>You haven't enrolled in any courses yet.</p>
                    <button onclick="app.navigateTo('courses')">Browse Courses</button>
                </div>
            `:`
            <div class="dashboard">
                <h1>My Dashboard</h1>
                <h2>My Enrolled Courses</h2>
                ${e.map(o=>{const s=t[o]||0;return`
                <div class="enrollment-card">
                    <h3>Course ${o}</h3>
                    <p>Progress: ${s}%</p>
                    <progress value="${s}" max="100"></progress>
                    <button onclick="app.completeLesson(${o})" style="margin-top: 10px;">Complete Lesson</button>
                </div>
            `}).join("")}
            </div>
        `}setupPageSpecificListeners(e){switch(e){case"login":this.setupLoginListeners();break}}setupLoginListeners(){const e=document.getElementById("login-form");e&&e.addEventListener("submit",async t=>{t.preventDefault(),await this.handleLogin()})}async handleLogin(){const e=document.getElementById("email").value,t=document.getElementById("password").value;try{await(await fetch(`${this.apiBase}/users/login`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`email=${encodeURIComponent(e)}&password=${encodeURIComponent(t)}`})).text()==="Login successful"?(this.saveUserToStorage({id:1,email:e,name:"Test User"}),alert("Login successful!"),this.navigateTo("dashboard")):alert("Invalid credentials")}catch(r){console.error("Login error:",r),e&&t?(this.saveUserToStorage({id:1,email:e,name:"Test User"}),alert("Login successful (mock)!"),this.navigateTo("dashboard")):alert("Please enter credentials")}}async enroll(e){if(!this.currentUser){alert("Please login to enroll in courses"),this.navigateTo("login");return}try{const r=await(await fetch(`${this.apiBase}/enrollments/enroll`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`userId=${this.currentUser.id}&courseId=${e}`})).text();alert(r);let o=JSON.parse(localStorage.getItem("enrolledCourses")||"[]");o.includes(e)||(o.push(e),localStorage.setItem("enrolledCourses",JSON.stringify(o)))}catch(t){console.error("Enrollment error:",t);let r=JSON.parse(localStorage.getItem("enrolledCourses")||"[]");r.includes(e)||(r.push(e),localStorage.setItem("enrolledCourses",JSON.stringify(r)),alert("Enrolled (local storage)"))}}completeLesson(e){let t=JSON.parse(localStorage.getItem("courseProgress")||"{}");t[e]=(t[e]||0)+10,t[e]>100&&(t[e]=100),localStorage.setItem("courseProgress",JSON.stringify(t)),this.currentUser&&fetch(`${this.apiBase}/enrollments/progress`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`userId=${this.currentUser.id}&courseId=${e}&progress=${t[e]}`}).catch(r=>console.error("Progress update error:",r)),this.loadPage("dashboard")}viewCourseDetail(e){history.pushState({page:"course-detail"},"",`#course-detail?id=${e}`),this.loadPage("course-detail")}showRegister(){alert("Registration feature coming soon!")}logout(){this.currentUser=null,localStorage.removeItem("learnhub_user"),this.updateNavigation(),this.navigateTo("home")}}document.addEventListener("DOMContentLoaded",()=>{window.app=new i});

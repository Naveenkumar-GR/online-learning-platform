<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Courses</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <header>
        <h1>Available Courses</h1>
        <nav>
            <a href="${pageContext.request.contextPath}/">Home</a>
            <a href="${pageContext.request.contextPath}/courses">Courses</a>
            <a href="${pageContext.request.contextPath}/login">Login</a>
        </nav>
    </header>

    <div class="course-container">
        <c:forEach var="course" items="${courses}">
            <div class="course-card">
                <h2>${course.title}</h2>
                <p>${course.description}</p>
                <p>Duration: ${course.duration} hours</p>
                <p>Instructor: ${course.instructor}</p>
                <a href="${pageContext.request.contextPath}/courses/${course.id}">View Details</a>
                <button onclick="enroll(${course.id})">Enroll</button>
            </div>
        </c:forEach>
    </div>

    <script>
        function enroll(courseId) {
            // For simplicity, assume userId is 1
            fetch('${pageContext.request.contextPath}/enrollments/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'userId=1&courseId=' + courseId
            }).then(response => response.text()).then(alert);
        }
    </script>
</body>
</html>
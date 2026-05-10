<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <header>
        <h1>Student Dashboard</h1>
        <nav>
            <a href="${pageContext.request.contextPath}/">Home</a>
            <a href="${pageContext.request.contextPath}/courses">Courses</a>
        </nav>
    </header>

    <div class="dashboard">
        <h2>My Enrolled Courses</h2>
        <c:forEach var="enrollment" items="${enrollments}">
            <div class="enrollment-card">
                <h3>Course ID: ${enrollment.courseId}</h3>
                <p>Progress: ${enrollment.progress}%</p>
                <progress value="${enrollment.progress}" max="100"></progress>
                <button onclick="updateProgress(${enrollment.userId}, ${enrollment.courseId}, ${enrollment.progress + 10})">Complete Lesson</button>
            </div>
        </c:forEach>
    </div>

    <script>
        function updateProgress(userId, courseId, progress) {
            fetch('${pageContext.request.contextPath}/enrollments/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'userId=' + userId + '&courseId=' + courseId + '&progress=' + progress
            }).then(response => response.text()).then(() => location.reload());
        }
    </script>
</body>
</html>
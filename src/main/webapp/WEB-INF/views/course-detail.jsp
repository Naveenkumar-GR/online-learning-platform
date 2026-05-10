<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Course Details</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <header>
        <h1>${course.title}</h1>
        <nav>
            <a href="${pageContext.request.contextPath}/">Home</a>
            <a href="${pageContext.request.contextPath}/courses">Courses</a>
        </nav>
    </header>

    <div class="course-detail">
        <h2>Description</h2>
        <p>${course.description}</p>
        <p>Duration: ${course.duration} hours</p>
        <p>Instructor: ${course.instructor}</p>
        <button onclick="enroll(${course.id})">Enroll Now</button>
    </div>

    <script>
        function enroll(courseId) {
            fetch('${pageContext.request.contextPath}/enrollments/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'userId=1&courseId=' + courseId
            }).then(response => response.text()).then(alert);
        }
    </script>
</body>
</html>
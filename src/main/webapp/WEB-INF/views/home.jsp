<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>LearnHub</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <header>
        <h1>LearnHub</h1>
        <nav>
            <a href="${pageContext.request.contextPath}/">Home</a>
            <a href="${pageContext.request.contextPath}/courses">Courses</a>
            <a href="${pageContext.request.contextPath}/login">Login</a>
        </nav>
    </header>

    <section class="hero">
        <h2>Online Learning Platform</h2>
        <p>Learn Java Full Stack Development</p>
        <a href="${pageContext.request.contextPath}/courses">Explore Courses</a>
    </section>
</body>
</html>
package com.learnhub.model;

public class Enrollment {
    private int id;
    private int userId;
    private int courseId;
    private int progress; // percentage 0-100

    // Constructors
    public Enrollment() {}

    public Enrollment(int id, int userId, int courseId, int progress) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.progress = progress;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
}
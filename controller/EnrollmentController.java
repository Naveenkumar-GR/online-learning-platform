package com.learnhub.controller;

import com.learnhub.dao.EnrollmentDao;
import com.learnhub.model.Enrollment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentDao enrollmentDao;

    @PostMapping("/enroll")
    @ResponseBody
    public String enroll(@RequestParam int userId, @RequestParam int courseId) {
        enrollmentDao.enrollUser(userId, courseId);
        return "Enrolled successfully";
    }

    @GetMapping("/user/{userId}")
    public String getUserEnrollments(@PathVariable int userId, Model model) {
        List<Enrollment> enrollments = enrollmentDao.getEnrollmentsByUserId(userId);
        model.addAttribute("enrollments", enrollments);
        return "dashboard";
    }

    @PostMapping("/progress")
    @ResponseBody
    public String updateProgress(@RequestParam int userId, @RequestParam int courseId, @RequestParam int progress) {
        enrollmentDao.updateProgress(userId, courseId, progress);
        return "Progress updated";
    }
}
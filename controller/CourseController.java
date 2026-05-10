package com.learnhub.controller;

import com.learnhub.dao.CourseDao;
import com.learnhub.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseDao courseDao;

    @GetMapping
    public String listCourses(Model model) {
        List<Course> courses = courseDao.getAllCourses();
        model.addAttribute("courses", courses);
        return "courses";
    }

    @GetMapping("/{id}")
    public String courseDetail(@PathVariable int id, Model model) {
        Course course = courseDao.getCourseById(id);
        model.addAttribute("course", course);
        return "course-detail";
    }

    @PostMapping
    @ResponseBody
    public String addCourse(@RequestBody Course course) {
        courseDao.addCourse(course);
        return "Course added successfully";
    }
}
package com.learnhub.controller;

import com.learnhub.dao.UserDao;
import com.learnhub.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserDao userDao;

    @PostMapping("/register")
    @ResponseBody
    public String register(@RequestBody User user) {
        userDao.addUser(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    @ResponseBody
    public String login(@RequestParam String email, @RequestParam String password) {
        if (userDao.authenticateUser(email, password)) {
            return "Login successful";
        } else {
            return "Invalid credentials";
        }
    }
}
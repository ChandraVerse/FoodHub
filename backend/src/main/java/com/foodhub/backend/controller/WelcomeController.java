package com.foodhub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public Map<String, Object> welcome() {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "FoodHub Spring backend is running");
        body.put("health", "/api/health");
        body.put("restaurants", "/api/restaurants");
        body.put("authSignup", "/api/auth/signup");
        body.put("authLogin", "/api/auth/login");
        return body;
    }
}


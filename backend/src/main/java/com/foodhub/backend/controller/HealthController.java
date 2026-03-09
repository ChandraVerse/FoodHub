package com.foodhub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Map<String, String> getHealth() {
        Map<String, String> result = new HashMap<>();
        result.put("status", "ok");
        result.put("message", "FoodHub Spring backend is running");
        return result;
    }
}


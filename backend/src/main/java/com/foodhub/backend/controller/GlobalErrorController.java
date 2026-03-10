package com.foodhub.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class GlobalErrorController implements ErrorController {

    @RequestMapping("/error")
    public Map<String, Object> handleError(HttpServletRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "FoodHub backend is running, but this path does not exist");
        body.put("path", request.getRequestURI());
        body.put("hint", "Use / for backend status, /api/health, /api/restaurants, /api/auth/signup, /api/auth/login");
        return body;
    }
}


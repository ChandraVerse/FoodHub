package com.foodhub.backend.controller;

import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.RestaurantRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping("/restaurants")
    public List<Restaurant> getRestaurants() {
        return restaurantRepository.findAll();
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {
        return restaurantRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(java.util.Map.of("message", "Restaurant not found")));
    }

}

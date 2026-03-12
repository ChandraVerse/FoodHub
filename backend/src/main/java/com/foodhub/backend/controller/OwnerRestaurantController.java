package com.foodhub.backend.controller;

import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.RestaurantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/owner/restaurants")
public class OwnerRestaurantController {

    private final RestaurantRepository restaurantRepository;

    public OwnerRestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping
    public List<Restaurant> getRestaurants() {
        return restaurantRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createRestaurant(@RequestBody @NonNull Restaurant restaurant) {
        Restaurant saved = restaurantRepository.save(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(@PathVariable @NonNull String id, @RequestBody @NonNull Restaurant update) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Restaurant not found"));
        }
        Restaurant existing = optionalRestaurant.get();
        existing.setName(update.getName());
        existing.setCuisine(update.getCuisine());
        existing.setRating(update.getRating());
        existing.setTime(update.getTime());
        existing.setPrice(update.getPrice());
        existing.setOwnerId(update.getOwnerId());
        existing.setDescription(update.getDescription());
        existing.setAddress(update.getAddress());
        existing.setCity(update.getCity());
        existing.setPincode(update.getPincode());
        existing.setPhone(update.getPhone());
        existing.setCoverImageUrl(update.getCoverImageUrl());
        Restaurant saved = restaurantRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable @NonNull String id) {
        if (!restaurantRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Restaurant not found"));
        }
        restaurantRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

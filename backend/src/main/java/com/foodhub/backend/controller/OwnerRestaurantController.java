package com.foodhub.backend.controller;

import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.RestaurantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
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
    public List<Restaurant> getRestaurants(Authentication authentication) {
        String ownerId = (String) authentication.getPrincipal();
        return restaurantRepository.findByOwnerId(ownerId);
    }

    @PostMapping
    public ResponseEntity<?> createRestaurant(Authentication authentication, @RequestBody @NonNull Restaurant restaurant) {
        String ownerId = (String) authentication.getPrincipal();
        restaurant.setOwnerId(ownerId);
        Restaurant saved = restaurantRepository.save(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(Authentication authentication, @PathVariable @NonNull String id, @RequestBody @NonNull Restaurant update) {
        String ownerId = (String) authentication.getPrincipal();
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Restaurant not found"));
        }
        Restaurant existing = optionalRestaurant.get();
        if (existing.getOwnerId() == null || !existing.getOwnerId().equals(ownerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not allowed to modify this restaurant"));
        }
        existing.setName(update.getName());
        existing.setCuisine(update.getCuisine());
        existing.setRating(update.getRating());
        existing.setTime(update.getTime());
        existing.setPrice(update.getPrice());
        existing.setDescription(update.getDescription());
        existing.setAddress(update.getAddress());
        existing.setCity(update.getCity());
        existing.setPincode(update.getPincode());
        existing.setPhone(update.getPhone());
        existing.setCoverImageUrl(update.getCoverImageUrl());
        existing.setOpen(update.getOpen());
        existing.setOpeningHours(update.getOpeningHours());
        existing.setMinOrderValue(update.getMinOrderValue());
        existing.setDeliveryFee(update.getDeliveryFee());
        existing.setPureVeg(update.getPureVeg());
        Restaurant saved = restaurantRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(Authentication authentication, @PathVariable @NonNull String id) {
        String ownerId = (String) authentication.getPrincipal();
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Restaurant not found"));
        }
        Restaurant existing = optionalRestaurant.get();
        if (existing.getOwnerId() == null || !existing.getOwnerId().equals(ownerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not allowed to delete this restaurant"));
        }
        restaurantRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

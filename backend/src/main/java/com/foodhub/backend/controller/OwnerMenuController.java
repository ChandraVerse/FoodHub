package com.foodhub.backend.controller;

import com.foodhub.backend.model.MenuItem;
import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.MenuItemRepository;
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
@RequestMapping("/api/owner/restaurants/{restaurantId}/menu")
public class OwnerMenuController {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    public OwnerMenuController(MenuItemRepository menuItemRepository, RestaurantRepository restaurantRepository) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    private boolean ownerCanAccess(Authentication authentication, String restaurantId) {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof String ownerId) || ownerId == null) {
            return false;
        }
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        return restaurant.isPresent()
                && restaurant.get().getOwnerId() != null
                && restaurant.get().getOwnerId().equals(ownerId);
    }

    @GetMapping
    public ResponseEntity<?> getMenu(Authentication authentication, @PathVariable @NonNull String restaurantId) {
        if (!ownerCanAccess(authentication, restaurantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not allowed to access this menu"));
        }
        List<MenuItem> items = menuItemRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<?> createMenuItem(Authentication authentication, @PathVariable @NonNull String restaurantId, @RequestBody @NonNull MenuItem menuItem) {
        if (!ownerCanAccess(authentication, restaurantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not allowed to modify this menu"));
        }
        menuItem.setRestaurantId(restaurantId);
        MenuItem saved = menuItemRepository.save(menuItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateMenuItem(Authentication authentication, @PathVariable @NonNull String restaurantId, @PathVariable @NonNull String itemId, @RequestBody @NonNull MenuItem update) {
        if (!ownerCanAccess(authentication, restaurantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not allowed to modify this menu"));
        }
        Optional<MenuItem> optionalMenuItem = menuItemRepository.findById(itemId);
        if (optionalMenuItem.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Menu item not found"));
        }
        MenuItem existing = optionalMenuItem.get();
        existing.setRestaurantId(restaurantId);
        existing.setName(update.getName());
        existing.setDescription(update.getDescription());
        existing.setCategory(update.getCategory());
        existing.setPrice(update.getPrice());
        existing.setImageUrl(update.getImageUrl());
        existing.setVeg(update.isVeg());
        existing.setAvailable(update.isAvailable());
        MenuItem saved = menuItemRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteMenuItem(Authentication authentication, @PathVariable @NonNull String restaurantId, @PathVariable @NonNull String itemId) {
        if (!ownerCanAccess(authentication, restaurantId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not allowed to modify this menu"));
        }
        if (!menuItemRepository.existsById(itemId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Menu item not found"));
        }
        menuItemRepository.deleteById(itemId);
        return ResponseEntity.noContent().build();
    }
}

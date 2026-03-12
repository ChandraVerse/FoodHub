package com.foodhub.backend.controller;

import com.foodhub.backend.model.MenuItem;
import com.foodhub.backend.repository.MenuItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/owner/restaurants/{restaurantId}/menu")
public class OwnerMenuController {

    private final MenuItemRepository menuItemRepository;

    public OwnerMenuController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public List<MenuItem> getMenu(@PathVariable @NonNull String restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    @PostMapping
    public ResponseEntity<?> createMenuItem(@PathVariable @NonNull String restaurantId, @RequestBody @NonNull MenuItem menuItem) {
        menuItem.setRestaurantId(restaurantId);
        MenuItem saved = menuItemRepository.save(menuItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateMenuItem(@PathVariable @NonNull String restaurantId, @PathVariable @NonNull String itemId, @RequestBody @NonNull MenuItem update) {
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
    public ResponseEntity<?> deleteMenuItem(@PathVariable @NonNull String itemId) {
        if (!menuItemRepository.existsById(itemId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Menu item not found"));
        }
        menuItemRepository.deleteById(itemId);
        return ResponseEntity.noContent().build();
    }
}

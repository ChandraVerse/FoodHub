package com.foodhub.backend.controller;

import com.foodhub.backend.model.MenuItem;
import com.foodhub.backend.repository.MenuItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu")
public class MenuController {

    private final MenuItemRepository menuItemRepository;

    public MenuController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenu(@PathVariable @NonNull String restaurantId) {
        List<MenuItem> items = menuItemRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(items);
    }
}


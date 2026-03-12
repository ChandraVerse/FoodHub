package com.foodhub.backend;

import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.MenuItemRepository;
import com.foodhub.backend.repository.RestaurantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FoodhubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodhubBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner demoDataCleanup(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        return args -> {
            var demoRestaurants = restaurantRepository.findAll().stream()
                    .filter(r -> r.getOwnerId() == null || r.getOwnerId().isBlank())
                    .toList();
            if (demoRestaurants.isEmpty()) {
                return;
            }
            var demoRestaurantIds = demoRestaurants.stream()
                    .map(Restaurant::getId)
                    .toList();
            for (String restaurantId : demoRestaurantIds) {
                var menuItems = menuItemRepository.findByRestaurantId(restaurantId);
                if (!menuItems.isEmpty()) {
                    menuItemRepository.deleteAll(menuItems);
                }
            }
            restaurantRepository.deleteAll(demoRestaurants);
        };
    }
}

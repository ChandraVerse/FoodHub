package com.foodhub.backend.controller;

import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.RestaurantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping
    public List<Restaurant> getRestaurants() {
        return restaurantRepository.findAll();
    }

    @Bean
    CommandLineRunner seedRestaurants(RestaurantRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Restaurant r1 = new Restaurant();
                r1.setName("Bella Italia");
                r1.setCuisine("Italian");
                r1.setRating(4.8);
                r1.setTime("20-30 min");
                r1.setPrice("$20 for two");

                Restaurant r2 = new Restaurant();
                r2.setName("Bombay Darbar");
                r2.setCuisine("Indian");
                r2.setRating(4.7);
                r2.setTime("25-35 min");
                r2.setPrice("$18 for two");

                Restaurant r3 = new Restaurant();
                r3.setName("Dragon Wok");
                r3.setCuisine("Chinese");
                r3.setRating(4.6);
                r3.setTime("30-40 min");
                r3.setPrice("$22 for two");

                Restaurant r4 = new Restaurant();
                r4.setName("Casa Mexicana");
                r4.setCuisine("Mexican");
                r4.setRating(4.5);
                r4.setTime("20-30 min");
                r4.setPrice("$19 for two");

                Restaurant r5 = new Restaurant();
                r5.setName("Osaka Sushi Bar");
                r5.setCuisine("Japanese");
                r5.setRating(4.9);
                r5.setTime("35-45 min");
                r5.setPrice("$35 for two");

                repository.saveAll(List.of(r1, r2, r3, r4, r5));
            }
        };
    }
}


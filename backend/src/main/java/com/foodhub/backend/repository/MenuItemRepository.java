package com.foodhub.backend.repository;

import com.foodhub.backend.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {

    List<MenuItem> findByRestaurantId(String restaurantId);
}


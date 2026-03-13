package com.foodhub.backend.repository;

import com.foodhub.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByRestaurantIdOrderByCreatedAtDesc(String restaurantId);
}


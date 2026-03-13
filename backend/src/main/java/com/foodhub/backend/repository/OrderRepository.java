package com.foodhub.backend.repository;

import com.foodhub.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByOwnerIdAndCreatedAtBetween(String ownerId, Instant start, Instant end);

    List<Order> findByRestaurantIdOrderByCreatedAtDesc(String restaurantId);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(String customerId);
}

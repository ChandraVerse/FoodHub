package com.foodhub.backend.controller;

import com.foodhub.backend.model.Order;
import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.OrderRepository;
import com.foodhub.backend.repository.RestaurantRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;

    public OrderController(OrderRepository orderRepository, RestaurantRepository restaurantRepository) {
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody @NonNull Order order) {
        if (order.getRestaurantId() == null || order.getRestaurantId().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "restaurantId is required"));
        }
        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "At least one item is required"));
        }
        Optional<Restaurant> restaurant =
                restaurantRepository.findById(order.getRestaurantId());
        if (restaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Restaurant not found"));
        }
        Restaurant r = restaurant.get();
        order.setOwnerId(r.getOwnerId());
        double total = order.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalAmount(total);
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("PLACED");
        }
        order.setCreatedAt(Instant.now());
        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrder(@PathVariable @NonNull String id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Order not found"));
        }
        return ResponseEntity.ok(optionalOrder.get());
    }

    @GetMapping("/owner/restaurants/{restaurantId}/orders")
    public ResponseEntity<?> getRestaurantOrders(Authentication authentication, @PathVariable @NonNull String restaurantId) {
        String ownerId = (String) authentication.getPrincipal();
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant.isEmpty() || restaurant.get().getOwnerId() == null ||
                !restaurant.get().getOwnerId().equals(ownerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Not allowed to view orders for this restaurant"));
        }
        List<Order> orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
        return ResponseEntity.ok(orders);
    }
}

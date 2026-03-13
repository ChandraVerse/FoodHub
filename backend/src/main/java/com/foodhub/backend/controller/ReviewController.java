package com.foodhub.backend.controller;

import com.foodhub.backend.model.Review;
import com.foodhub.backend.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public ResponseEntity<?> getReviews(@PathVariable @NonNull String restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
        double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        Map<String, Object> body = new HashMap<>();
        body.put("averageRating", average);
        body.put("reviews", reviews);
        return ResponseEntity.ok(body);
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            Authentication authentication,
            @PathVariable @NonNull String restaurantId,
            @RequestBody @NonNull Review review
    ) {
        if (authentication == null || !(authentication.getPrincipal() instanceof String customerId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }
        if (review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Rating must be between 1 and 5"));
        }
        review.setId(null);
        review.setRestaurantId(restaurantId);
        review.setCustomerId(customerId);
        review.setCreatedAt(Instant.now());
        Review saved = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}


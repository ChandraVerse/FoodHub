package com.foodhub.backend.controller;

import com.foodhub.backend.model.Order;
import com.foodhub.backend.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner/metrics")
public class OwnerMetricsController {

    private final OrderRepository orderRepository;

    public OwnerMetricsController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMetrics(Authentication authentication) {
        String ownerId = (String) authentication.getPrincipal();
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        Instant startOfToday = today.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant startOfTomorrow = today.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        LocalDate firstOfMonth = today.withDayOfMonth(1);
        Instant startOfMonth = firstOfMonth.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant startOfNextMonth = firstOfMonth.plusMonths(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        List<Order> todayOrders = orderRepository.findByOwnerIdAndCreatedAtBetween(
                ownerId, startOfToday, startOfTomorrow);
        List<Order> monthOrders = orderRepository.findByOwnerIdAndCreatedAtBetween(
                ownerId, startOfMonth, startOfNextMonth);

        int ordersToday = todayOrders.size();
        double monthlyRevenue = monthOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
        int totalOrdersThisMonth = monthOrders.size();

        Map<String, Integer> itemCounts = new HashMap<>();
        for (Order order : monthOrders) {
            if (order.getItems() == null) {
                continue;
            }
            order.getItems().forEach(item -> {
                String name = item.getName();
                if (name != null) {
                    itemCounts.merge(name, item.getQuantity(), Integer::sum);
                }
            });
        }

        Map<String, Object> body = new HashMap<>();
        body.put("ordersToday", ordersToday);
        body.put("monthlyRevenue", monthlyRevenue);
        body.put("totalOrdersThisMonth", totalOrdersThisMonth);
        body.put("topItems", itemCounts);
        return ResponseEntity.ok(body);
    }
}

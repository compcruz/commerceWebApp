package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.dto.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private com.example.demo.service.EmailService emailService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/mine")
    public List<Order> getMyOrders(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return orderRepository.findAll().stream()
            .filter(order -> order.getUser().getId().equals(user.getId()))
            .toList();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Product> products = new ArrayList<>();
        for (OrderRequest.Item item : orderRequest.items) {
            Product product = productRepository.findById(item.productId).orElseThrow();
            if (product.getStock() < item.quantity) throw new RuntimeException("Insufficient stock for " + product.getName());
            product.setStock(product.getStock() - item.quantity);
            productRepository.save(product);
            for (int i = 0; i < item.quantity; i++) {
                products.add(product);
            }
        }
        Order order = new Order();
        order.setUser(user);
        order.setProducts(products);
        order.setOrderDate(LocalDateTime.now());
        order.setName(orderRequest.name);
        order.setStreet(orderRequest.street);
        order.setCity(orderRequest.city);
        order.setState(orderRequest.state);
        order.setZip(orderRequest.zip);
        order.setCountry(orderRequest.country);
        Order savedOrder = orderRepository.save(order);
        try {
            emailService.sendOrderConfirmation(user.getEmail(), savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return savedOrder;
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order order) {
        order.setId(id);
        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}

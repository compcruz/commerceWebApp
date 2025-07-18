package com.example.demo.dto;

import java.util.List;

public class OrderRequest {
    public static class Item {
        public Long productId;
        public int quantity;
    }
    public List<Item> items;
}

package com.example.demo.dto;

import java.util.List;

public class OrderRequest {
    public String status;

    public static class Item {
        public Long productId;
        public int quantity;
    }
    public List<Item> items;

    // Getters and setters for all fields
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Address fields
    public String name;
    public String street;
    public String city;
    public String state;
    public String zip;
    public String country;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}

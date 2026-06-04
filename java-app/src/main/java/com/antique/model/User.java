package com.antique.model;

public class User {
    private String id;
    private String name;
    private String email;
    private String password;
    private String contactNumber;
    private String shippingAddress;
    private String role; // BUYER or ADMIN
    private String status; // PENDING, APPROVED, REJECTED

    public User() {}

    public User(String id, String name, String email, String password, String contactNumber, String role, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.contactNumber = contactNumber;
        this.role = role;
        this.status = status;
    }

    public User(String id, String name, String email, String password, String contactNumber, String shippingAddress, String role, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.contactNumber = contactNumber;
        this.shippingAddress = shippingAddress;
        this.role = role;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

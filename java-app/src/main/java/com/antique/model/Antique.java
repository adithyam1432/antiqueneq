package com.antique.model;

import java.math.BigDecimal;

public class Antique {
    private String id;
    private String sellerId; // References users(id) (Admin)
    private String sellerName; // Helper for UI display
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private String status; // PENDING, APPROVED, REJECTED, SOLD
    private BigDecimal commissionRate;
    private BigDecimal deliveryCharge;

    public Antique() {}

    public Antique(String id, String sellerId, String title, String description, BigDecimal price, String category, String imageUrl, String status, BigDecimal commissionRate, BigDecimal deliveryCharge) {
        this.id = id;
        this.sellerId = sellerId;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.status = status;
        this.commissionRate = commissionRate;
        this.deliveryCharge = deliveryCharge;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }
}

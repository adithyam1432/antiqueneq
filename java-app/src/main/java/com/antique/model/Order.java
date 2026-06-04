package com.antique.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Order {
    private String id;
    private String buyerId;
    private String productId;
    private String buyerName;
    private String buyerEmail;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private BigDecimal deliveryCharge;
    private String status; // PENDING, CONFIRMED, PACKED, DELIVERING, SHIPPED, REJECTED
    private String proofUrl;
    private String remarks;
    private Timestamp createdAt;

    // Helper fields for UI display
    private String productTitle;
    private String productImageUrl;

    public Order() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProofUrl() { return proofUrl; }
    public void setProofUrl(String proofUrl) { this.proofUrl = proofUrl; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }
}

package com.antique.dao;

import com.antique.db.DBConnection;
import com.antique.model.Order;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    public boolean createOrder(Order order) {
        String insertOrderSql = "INSERT INTO orders (id, buyer_id, product_id, buyer_name, buyer_email, shipping_address, total_amount, delivery_charge, status, proof_url, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String updateProductSql = "UPDATE antiques SET status = 'SOLD' WHERE id = ?";
        
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement psOrder = conn.prepareStatement(insertOrderSql);
                 PreparedStatement psProduct = conn.prepareStatement(updateProductSql)) {
                
                // 1. Insert Order
                psOrder.setString(1, order.getId());
                psOrder.setString(2, order.getBuyerId());
                psOrder.setString(3, order.getProductId());
                psOrder.setString(4, order.getBuyerName());
                psOrder.setString(5, order.getBuyerEmail());
                psOrder.setString(6, order.getShippingAddress());
                psOrder.setBigDecimal(7, order.getTotalAmount());
                psOrder.setBigDecimal(8, order.getDeliveryCharge());
                psOrder.setString(9, order.getStatus());
                psOrder.setString(10, order.getProofUrl());
                psOrder.setString(11, order.getRemarks());
                psOrder.executeUpdate();

                // 2. Update Antique Status to SOLD
                psProduct.setString(1, order.getProductId());
                psProduct.executeUpdate();

                conn.commit();
                return true;
            } catch (SQLException e) {
                if (conn != null) conn.rollback();
                throw e;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public List<Order> getOrdersByBuyerId(String buyerId) {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT o.*, a.title as product_title, a.image_url as product_image_url FROM orders o JOIN antiques a ON o.product_id = a.id WHERE o.buyer_id = ? ORDER BY o.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, buyerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToOrder(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Order> getAllOrders() {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT o.*, a.title as product_title, a.image_url as product_image_url FROM orders o JOIN antiques a ON o.product_id = a.id ORDER BY o.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapRowToOrder(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean updateOrderStatus(String orderId, String status) {
        String updateOrderSql = "UPDATE orders SET status = ? WHERE id = ?";
        String getProductSql = "SELECT product_id FROM orders WHERE id = ?";
        String updateProductSql = "UPDATE antiques SET status = 'APPROVED' WHERE id = ?";
        
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);
            
            try (PreparedStatement psOrder = conn.prepareStatement(updateOrderSql)) {
                psOrder.setString(1, status);
                psOrder.setString(2, orderId);
                psOrder.executeUpdate();
                
                // If rejected, release product back to APPROVED
                if ("REJECTED".equals(status)) {
                    String productId = null;
                    try (PreparedStatement psGetProd = conn.prepareStatement(getProductSql)) {
                        psGetProd.setString(1, orderId);
                        try (ResultSet rs = psGetProd.executeQuery()) {
                            if (rs.next()) {
                                productId = rs.getString("product_id");
                            }
                        }
                    }
                    if (productId != null) {
                        try (PreparedStatement psProduct = conn.prepareStatement(updateProductSql)) {
                            psProduct.setString(1, productId);
                            psProduct.executeUpdate();
                        }
                    }
                }
                
                conn.commit();
                return true;
            } catch (SQLException e) {
                if (conn != null) conn.rollback();
                throw e;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public boolean updateOrderProof(String orderId, String proofUrl, String remarks) {
        String sql = "UPDATE orders SET proof_url = ?, remarks = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, proofUrl);
            ps.setString(2, remarks);
            ps.setString(3, orderId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private Order mapRowToOrder(ResultSet rs) throws SQLException {
        Order order = new Order();
        order.setId(rs.getString("id"));
        order.setBuyerId(rs.getString("buyer_id"));
        order.setProductId(rs.getString("product_id"));
        order.setBuyerName(rs.getString("buyer_name"));
        order.setBuyerEmail(rs.getString("buyer_email"));
        order.setShippingAddress(rs.getString("shipping_address"));
        order.setTotalAmount(rs.getBigDecimal("total_amount"));
        order.setDeliveryCharge(rs.getBigDecimal("delivery_charge"));
        order.setStatus(rs.getString("status"));
        order.setProofUrl(rs.getString("proof_url"));
        order.setRemarks(rs.getString("remarks"));
        order.setCreatedAt(rs.getTimestamp("created_at"));
        
        order.setProductTitle(rs.getString("product_title"));
        order.setProductImageUrl(rs.getString("product_image_url"));
        return order;
    }
}

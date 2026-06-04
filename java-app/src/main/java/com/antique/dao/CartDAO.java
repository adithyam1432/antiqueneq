package com.antique.dao;

import com.antique.db.DBConnection;
import com.antique.model.CartItem;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CartDAO {

    public boolean addToCart(CartItem item) {
        // If item already in cart, increment quantity
        String checkSql = "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement psCheck = conn.prepareStatement(checkSql)) {
            psCheck.setString(1, item.getUserId());
            psCheck.setString(2, item.getProductId());
            try (ResultSet rs = psCheck.executeQuery()) {
                if (rs.next()) {
                    int existingId = rs.getInt("id");
                    int newQty = rs.getInt("quantity") + 1;
                    String updateSql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
                    try (PreparedStatement psUpdate = conn.prepareStatement(updateSql)) {
                        psUpdate.setInt(1, newQty);
                        psUpdate.setInt(2, existingId);
                        return psUpdate.executeUpdate() > 0;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Otherwise insert new item
        String sql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, item.getUserId());
            ps.setString(2, item.getProductId());
            ps.setInt(3, item.getQuantity());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<CartItem> getCartByUserId(String userId) {
        List<CartItem> list = new ArrayList<>();
        String sql = "SELECT c.*, a.title as product_title, a.price as product_price, a.image_url as product_image_url " +
                     "FROM cart_items c JOIN antiques a ON c.product_id = a.id WHERE c.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CartItem item = new CartItem();
                    item.setId(rs.getInt("id"));
                    item.setUserId(rs.getString("user_id"));
                    item.setProductId(rs.getString("product_id"));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setProductTitle(rs.getString("product_title"));
                    item.setProductPrice(rs.getBigDecimal("product_price"));
                    item.setProductImageUrl(rs.getString("product_image_url"));
                    list.add(item);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean removeCartItem(int id) {
        String sql = "DELETE FROM cart_items WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean clearCart(String userId) {
        String sql = "DELETE FROM cart_items WHERE user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}

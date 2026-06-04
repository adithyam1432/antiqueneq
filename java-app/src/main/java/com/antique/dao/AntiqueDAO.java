package com.antique.dao;

import com.antique.db.DBConnection;
import com.antique.model.Antique;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AntiqueDAO {

    public boolean createAntique(Antique antique) {
        String sql = "INSERT INTO antiques (id, seller_id, title, description, price, category, image_url, status, commission_rate, delivery_charge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, antique.getId());
            ps.setString(2, antique.getSellerId());
            ps.setString(3, antique.getTitle());
            ps.setString(4, antique.getDescription());
            ps.setBigDecimal(5, antique.getPrice());
            ps.setString(6, antique.getCategory());
            ps.setString(7, antique.getImageUrl());
            ps.setString(8, antique.getStatus());
            ps.setBigDecimal(9, antique.getCommissionRate());
            ps.setBigDecimal(10, antique.getDeliveryCharge());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Antique getAntiqueById(String id) {
        String sql = "SELECT a.*, u.name as seller_name FROM antiques a JOIN users u ON a.seller_id = u.id WHERE a.id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRowToAntique(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Antique> getAllApprovedAntiques() {
        List<Antique> list = new ArrayList<>();
        String sql = "SELECT a.*, u.name as seller_name FROM antiques a JOIN users u ON a.seller_id = u.id WHERE a.status = 'APPROVED' ORDER BY a.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapRowToAntique(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Antique> getPendingAntiques() {
        List<Antique> list = new ArrayList<>();
        String sql = "SELECT a.*, u.name as seller_name FROM antiques a JOIN users u ON a.seller_id = u.id WHERE a.status = 'PENDING' ORDER BY a.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapRowToAntique(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Antique> getAllAntiques() {
        List<Antique> list = new ArrayList<>();
        String sql = "SELECT a.*, u.name as seller_name FROM antiques a JOIN users u ON a.seller_id = u.id ORDER BY a.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapRowToAntique(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean updateAntiqueStatus(String id, String status) {
        String sql = "UPDATE antiques SET status = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setString(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteAntique(String id) {
        String sql = "DELETE FROM antiques WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private Antique mapRowToAntique(ResultSet rs) throws SQLException {
        Antique antique = new Antique(
            rs.getString("id"),
            rs.getString("seller_id"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getBigDecimal("price"),
            rs.getString("category"),
            rs.getString("image_url"),
            rs.getString("status"),
            rs.getBigDecimal("commission_rate"),
            rs.getBigDecimal("delivery_charge")
        );
        antique.setSellerName(rs.getString("seller_name"));
        return antique;
    }
}

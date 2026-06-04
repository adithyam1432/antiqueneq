package com.antique.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Statement;
import java.sql.ResultSet;

public class DBConnection {
    private static final String HOST = "127.0.0.1";
    private static final String USER = "root";
    private static final String DATABASE = "antiques_jdbc_db";
    private static String activePassword = null;
    private static boolean passwordDetected = false;

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found in classpath!");
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        String url = "jdbc:mysql://" + HOST + ":3306/" + DATABASE + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        
        if (passwordDetected) {
            return DriverManager.getConnection(url, USER, activePassword);
        }

        // Try to auto-detect the password
        String[] commonPasswords = {"", "root", "admin123", "root123", "admin"};
        
        for (String pass : commonPasswords) {
            try {
                String serverUrl = "jdbc:mysql://" + HOST + ":3306/?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
                Connection conn = DriverManager.getConnection(serverUrl, USER, pass);
                
                activePassword = pass;
                passwordDetected = true;
                
                // Ensure target database exists
                conn.createStatement().execute("CREATE DATABASE IF NOT EXISTS " + DATABASE);
                conn.close();
                
                System.out.println("[JDBC] Successfully connected to MySQL server using password: " + (pass.isEmpty() ? "(none)" : pass));
                
                // Initialize database tables
                Connection dbConn = DriverManager.getConnection(url, USER, activePassword);
                initializeDatabase(dbConn);
                dbConn.close();

                return DriverManager.getConnection(url, USER, activePassword);
            } catch (SQLException e) {
                // Attempt next password
            }
        }
        
        // Final fallback
        return DriverManager.getConnection(url, USER, "");
    }

    private static void initializeDatabase(Connection conn) {
        try {
            Statement checkStmt = conn.createStatement();
            ResultSet rs = checkStmt.executeQuery(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '" + DATABASE + "' AND table_name = 'users'"
            );
            boolean tablesExist = false;
            if (rs.next() && rs.getInt(1) > 0) {
                tablesExist = true;
            }
            rs.close();
            checkStmt.close();

            if (!tablesExist) {
                InputStream is = DBConnection.class.getClassLoader().getResourceAsStream("schema.sql");
                if (is == null) {
                    System.err.println("[JDBC] schema.sql not found in resources!");
                    return;
                }

                BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line).append("\n");
                }
                reader.close();

                String[] statements = sb.toString().split(";");
                Statement stmt = conn.createStatement();
                for (String sql : statements) {
                    String trimmed = sql.trim();
                    if (!trimmed.isEmpty()) {
                        stmt.execute(trimmed);
                    }
                }
                stmt.close();
                System.out.println("[JDBC] Database tables initialized and seeded successfully.");
            } else {
                updateSchemaIfNeeded(conn);
            }

            ensureTenSeedAntiques(conn);

        } catch (Exception e) {
            System.err.println("[JDBC] Failed to initialize database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void updateSchemaIfNeeded(Connection conn) {
        String[] alterStatements = {
            "ALTER TABLE users ADD COLUMN shipping_address TEXT",
            "ALTER TABLE orders ADD COLUMN proof_url VARCHAR(255)",
            "ALTER TABLE orders ADD COLUMN remarks TEXT",
            "ALTER TABLE orders MODIFY COLUMN status ENUM('PENDING', 'CONFIRMED', 'PACKED', 'DELIVERING', 'SHIPPED', 'REJECTED') DEFAULT 'PENDING'"
        };
        try (Statement stmt = conn.createStatement()) {
            for (String sql : alterStatements) {
                try {
                    stmt.execute(sql);
                } catch (SQLException e) {
                    // Ignore duplicate column/index errors (1060, 1061) or modified columns
                    if (e.getErrorCode() != 1060 && e.getErrorCode() != 1061 && e.getErrorCode() != 1091) {
                        System.out.println("[JDBC Schema Migration] Warning: " + e.getMessage());
                    }
                }
            }
            System.out.println("[JDBC Schema Migration] Schema check/update completed.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void ensureTenSeedAntiques(Connection conn) {
        try {
            int count = 0;
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM antiques")) {
                if (rs.next()) {
                    count = rs.getInt(1);
                }
            }
            if (count < 10) {
                String seedSql = "INSERT IGNORE INTO antiques (id, seller_id, title, description, price, category, status, image_url) VALUES " +
                    "('antique-001', 'admin-001', 'Teal Filigree Vase', 'Hand-painted masterpiece from the late 17th century.', 85000.00, 'Ceramics', 'APPROVED', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-002', 'admin-001', 'Victorian Pocket Watch', 'Exquisite gold watch with intricate carvings.', 45000.00, 'Horology', 'APPROVED', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-003', 'admin-001', 'Tanjore Saraswati Painting', 'Traditional Tanjore painting with 22ct gold foil and precious stones from Tamil Nadu.', 120000.00, 'Fine Art', 'APPROVED', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-004', 'admin-001', 'Mughal Brass Astrolabe', 'Intricate 17th-century astronomical instrument used to calculate time and celestial positions.', 95000.00, 'Scientific', 'APPROVED', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-005', 'admin-001', 'Chola Dynasty Bronze Nataraja', 'A rare, hand-cast lost-wax bronze representation of Lord Shiva as the cosmic dancer.', 350000.00, 'Sculpture', 'APPROVED', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-006', 'admin-001', 'Royal Rajasthani Mirror', 'Heavily ornamented teakwood mirror frame decorated with inlaid mirror mosaics from Jaipur.', 150000.00, 'Furniture', 'APPROVED', 'https://images.unsplash.com/photo-1596162954151-cd5415b30796?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-007', 'admin-001', 'Mysore Rosewood Keepsake Box', '19th-century Mysore rosewood keepsake box with delicate ivory-imitation bone floral inlay.', 65000.00, 'Collectibles', 'APPROVED', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-008', 'admin-001', 'Anglo-Indian Carved Armchair', 'Late Victorian period armchair featuring intricate floral carvings and cabriole legs.', 110000.00, 'Furniture', 'APPROVED', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-009', 'admin-001', 'Peshwa Silver Bidri Hookah Base', 'Traditional Bidriware zinc-copper alloy vessel inlaid with pure silver wires from Deccan.', 78000.00, 'Metalware', 'APPROVED', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600')," +
                    "('antique-010', 'admin-001', 'Kutch Embroidered Silk Tapestry', 'Color mirror-work silk panel hand-embroidered by Kutchi tribal artisans, circa 1880.', 55000.00, 'Textiles', 'APPROVED', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600')";
                try (Statement stmt = conn.createStatement()) {
                    stmt.execute(seedSql);
                    System.out.println("[JDBC] 10 high-quality seed antiques populated.");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

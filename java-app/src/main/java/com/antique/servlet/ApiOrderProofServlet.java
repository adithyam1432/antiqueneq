package com.antique.servlet;

import com.antique.dao.OrderDAO;
import com.antique.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@WebServlet("/api/orders/upload-proof")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2, // 2MB
    maxFileSize = 1024 * 1024 * 10,      // 10MB
    maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class ApiOrderProofServlet extends HttpServlet {
    private final OrderDAO orderDAO = new OrderDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Sign in required.\"}");
            return;
        }

        String orderIdsStr = request.getParameter("orderIds");
        String remarks = request.getParameter("remarks");

        if (orderIdsStr == null || orderIdsStr.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"No order IDs specified.\"}");
            return;
        }

        Part part = request.getPart("proof");
        if (part == null || part.getSize() == 0) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Proof of payment file is required.\"}");
            return;
        }

        // Save file
        String fileName = UUID.randomUUID().toString() + "_" + getFileName(part);
        String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        part.write(uploadPath + File.separator + fileName);
        String proofUrl = "uploads/" + fileName;

        String[] orderIds = orderIdsStr.split(",");
        boolean anyUpdated = false;

        for (String id : orderIds) {
            if (id != null && !id.trim().isEmpty()) {
                if (orderDAO.updateOrderProof(id.trim(), proofUrl, remarks != null ? remarks.trim() : "")) {
                    anyUpdated = true;
                }
            }
        }

        if (anyUpdated) {
            response.getWriter().write("{\"success\": true}");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Failed to update transaction proof for orders.\"}");
        }
    }

    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf("=") + 2, token.length() - 1);
            }
        }
        return "proof.jpg";
    }
}

package com.antique.servlet;

import com.antique.dao.AntiqueDAO;
import com.antique.model.Antique;
import com.antique.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.UUID;

@WebServlet("/admin-dashboard/add-product")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2, // 2MB
    maxFileSize = 1024 * 1024 * 10,      // 10MB
    maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class AdminAddProductServlet extends HttpServlet {
    private final AntiqueDAO antiqueDAO = new AntiqueDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null || !"ADMIN".equals(user.getRole())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String priceStr = request.getParameter("price");
        String category = request.getParameter("category");

        if (title == null || title.trim().isEmpty() || priceStr == null || priceStr.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/admin-dashboard?error=MissingFields");
            return;
        }

        BigDecimal price;
        try {
            price = new BigDecimal(priceStr);
        } catch (NumberFormatException e) {
            response.sendRedirect(request.getContextPath() + "/admin-dashboard?error=InvalidPrice");
            return;
        }

        // Image upload logic
        String imageUrl = "";
        Part part = request.getPart("image");
        if (part != null && part.getSize() > 0) {
            String fileName = UUID.randomUUID().toString() + "_" + getFileName(part);
            String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            part.write(uploadPath + File.separator + fileName);
            imageUrl = "uploads/" + fileName;
        } else {
            imageUrl = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600";
        }

        Antique antique = new Antique(
            UUID.randomUUID().toString(),
            user.getId(),
            title,
            description,
            price,
            category != null ? category : "General",
            imageUrl,
            "APPROVED", // Listed immediately as approved
            new BigDecimal("10.00"), // default commission 10%
            new BigDecimal("500.00") // default delivery charge
        );

        if (antiqueDAO.createAntique(antique)) {
            response.sendRedirect(request.getContextPath() + "/admin-dashboard?success=ProductAdded");
        } else {
            response.sendRedirect(request.getContextPath() + "/admin-dashboard?error=DbInsertFailed");
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
        return "default.jpg";
    }
}

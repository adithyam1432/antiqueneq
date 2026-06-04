package com.antique.servlet;

import com.antique.dao.AntiqueDAO;
import com.antique.model.Antique;
import com.antique.model.User;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@WebServlet("/api/antiques")
public class ApiAntiqueServlet extends HttpServlet {
    private final AntiqueDAO antiqueDAO = new AntiqueDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        List<Antique> antiques = antiqueDAO.getAllApprovedAntiques();
        resp.getWriter().write(gson.toJson(antiques));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null || !"ADMIN".equals(user.getRole())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"error\": \"Only administrators can add antique items.\"}");
            return;
        }

        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        String title = json.has("title") ? json.get("title").getAsString() : "";
        String description = json.has("description") ? json.get("description").getAsString() : "";
        BigDecimal price = json.has("price") ? json.get("price").getAsBigDecimal() : BigDecimal.ZERO;
        String category = json.has("category") ? json.get("category").getAsString() : "";
        String imageUrl = json.has("image_url") ? json.get("image_url").getAsString() : "";

        if (title.isEmpty() || price.compareTo(BigDecimal.ZERO) <= 0) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Title and positive price are required.\"}");
            return;
        }

        Antique antique = new Antique(
            UUID.randomUUID().toString(),
            user.getId(), // Point to Admin lister
            title,
            description,
            price,
            category,
            imageUrl,
            "APPROVED", // Admin lister items are pre-approved
            new BigDecimal("10.00"),
            new BigDecimal("500.00")
        );

        if (antiqueDAO.createAntique(antique)) {
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(antique));
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\": \"Failed to create antique listing.\"}");
        }
    }
}

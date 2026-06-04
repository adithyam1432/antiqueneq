package com.antique.servlet;

import com.antique.dao.UserDAO;
import com.antique.model.User;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.UUID;

@WebServlet("/api/auth/*")
public class ApiAuthServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String pathInfo = req.getPathInfo();
        if ("/login".equals(pathInfo)) {
            handleLogin(req, resp);
        } else if ("/admin-login".equals(pathInfo)) {
            handleAdminLogin(req, resp);
        } else if ("/register".equals(pathInfo)) {
            handleRegister(req, resp);
        } else if ("/logout".equals(pathInfo)) {
            handleLogout(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\": \"Endpoint not found\"}");
        }
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        String email = json.has("email") ? json.get("email").getAsString() : "";
        String password = json.has("password") ? json.get("password").getAsString() : "";

        User user = userDAO.authenticate(email, password);
        if (user != null) {
            if ("ADMIN".equals(user.getRole())) {
                resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                resp.getWriter().write("{\"error\": \"Admin authentication not allowed on this gateway\"}");
                return;
            }

            HttpSession session = req.getSession(true);
            session.setAttribute("user", user);

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", true);
            
            JsonObject userObj = new JsonObject();
            userObj.addProperty("id", user.getId());
            userObj.addProperty("name", user.getName());
            userObj.addProperty("email", user.getEmail());
            userObj.addProperty("role", user.getRole());
            responseJson.add("user", userObj);

            resp.getWriter().write(gson.toJson(responseJson));
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Invalid email or password\"}");
        }
    }

    private void handleAdminLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        String email = json.has("email") ? json.get("email").getAsString() : "";
        String password = json.has("password") ? json.get("password").getAsString() : "";

        User user = userDAO.authenticate(email, password);
        if (user != null && "ADMIN".equals(user.getRole())) {
            HttpSession session = req.getSession(true);
            session.setAttribute("user", user);

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", true);
            
            JsonObject userObj = new JsonObject();
            userObj.addProperty("id", user.getId());
            userObj.addProperty("name", user.getName());
            userObj.addProperty("email", user.getEmail());
            userObj.addProperty("role", user.getRole());
            responseJson.add("user", userObj);

            resp.getWriter().write(gson.toJson(responseJson));
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Challenge rejected. Invalid admin credentials.\"}");
        }
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        String name = json.has("name") ? json.get("name").getAsString() : "";
        String email = json.has("email") ? json.get("email").getAsString().trim().toLowerCase() : "";
        String password = json.has("password") ? json.get("password").getAsString() : "";
        String contact = json.has("contact_number") ? json.get("contact_number").getAsString() : "";

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Name, email, and password are required\"}");
            return;
        }

        if (userDAO.getUserByEmail(email) != null) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write("{\"error\": \"User with this email already exists\"}");
            return;
        }

        User user = new User(
            UUID.randomUUID().toString(),
            name,
            email,
            password,
            contact,
            "BUYER",
            "APPROVED"
        );

        if (userDAO.createUser(user)) {
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"success\": true, \"message\": \"Account created successfully\"}");
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\": \"Failed to create account\"}");
        }
    }

    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        resp.getWriter().write("{\"success\": true}");
    }
}

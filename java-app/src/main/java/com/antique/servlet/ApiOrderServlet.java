package com.antique.servlet;

import com.antique.dao.AntiqueDAO;
import com.antique.dao.CartDAO;
import com.antique.dao.OrderDAO;
import com.antique.model.Antique;
import com.antique.model.CartItem;
import com.antique.model.Order;
import com.antique.model.User;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@WebServlet("/api/orders")
public class ApiOrderServlet extends HttpServlet {
    private final OrderDAO orderDAO = new OrderDAO();
    private final CartDAO cartDAO = new CartDAO();
    private final AntiqueDAO antiqueDAO = new AntiqueDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Sign in required.\"}");
            return;
        }

        if ("ADMIN".equals(user.getRole())) {
            List<Order> allOrders = orderDAO.getAllOrders();
            resp.getWriter().write(gson.toJson(allOrders));
        } else {
            List<Order> buyerOrders = orderDAO.getOrdersByBuyerId(user.getId());
            resp.getWriter().write(gson.toJson(buyerOrders));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Sign in required.\"}");
            return;
        }

        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        String shippingAddress = json.has("shippingAddress") ? json.get("shippingAddress").getAsString() : "";
        String buyerName = json.has("buyerName") ? json.get("buyerName").getAsString() : user.getName();
        String buyerEmail = json.has("buyerEmail") ? json.get("buyerEmail").getAsString() : user.getEmail();

        if (shippingAddress.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Shipping address is required.\"}");
            return;
        }

        List<CartItem> cartItems = cartDAO.getCartByUserId(user.getId());
        if (cartItems.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Cart is empty.\"}");
            return;
        }

        JsonArray orderedIds = new JsonArray();
        boolean success = true;

        for (CartItem item : cartItems) {
            Antique antique = antiqueDAO.getAntiqueById(item.getProductId());
            if (antique == null || !"APPROVED".equals(antique.getStatus())) {
                success = false;
                break;
            }

            Order order = new Order();
            order.setId("ord-" + UUID.randomUUID().toString());
            order.setBuyerId(user.getId());
            order.setProductId(antique.getId());
            order.setBuyerName(buyerName);
            order.setBuyerEmail(buyerEmail);
            order.setShippingAddress(shippingAddress);
            order.setDeliveryCharge(antique.getDeliveryCharge());
            order.setTotalAmount(antique.getPrice().add(antique.getDeliveryCharge()));
            order.setStatus("PENDING");

            if (orderDAO.createOrder(order)) {
                orderedIds.add(order.getId());
            } else {
                success = false;
                break;
            }
        }

        if (success) {
            cartDAO.clearCart(user.getId());
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", true);
            responseJson.add("orderIds", orderedIds);
            resp.getWriter().write(gson.toJson(responseJson));
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\": \"An item in your cart is no longer available or checkout failed.\"}");
        }
    }
}

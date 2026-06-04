package com.antique.servlet;

import com.antique.dao.CartDAO;
import com.antique.model.CartItem;
import com.antique.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@WebServlet(urlPatterns = {"/cart", "/cart/*"})
public class CartServlet extends HttpServlet {
    private final CartDAO cartDAO = new CartDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            resp.sendRedirect(req.getContextPath() + "/login.jsp");
            return;
        }

        List<CartItem> cartItems = cartDAO.getCartByUserId(user.getId());
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            BigDecimal qty = new BigDecimal(item.getQuantity());
            total = total.add(item.getProductPrice().multiply(qty));
        }

        req.setAttribute("cartItems", cartItems);
        req.setAttribute("cartTotal", total);
        req.getRequestDispatcher("/cart.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            resp.sendRedirect(req.getContextPath() + "/login.jsp");
            return;
        }

        String action = req.getPathInfo();
        if ("/add".equals(action)) {
            String productId = req.getParameter("productId");
            if (productId != null) {
                CartItem item = new CartItem();
                item.setUserId(user.getId());
                item.setProductId(productId);
                item.setQuantity(1);
                cartDAO.addToCart(item);
            }
            resp.sendRedirect(req.getContextPath() + "/cart");
        } else if ("/remove".equals(action)) {
            String itemIdStr = req.getParameter("itemId");
            if (itemIdStr != null) {
                try {
                    int itemId = Integer.parseInt(itemIdStr);
                    cartDAO.removeCartItem(itemId);
                } catch (NumberFormatException e) {
                    e.printStackTrace();
                }
            }
            resp.sendRedirect(req.getContextPath() + "/cart");
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}

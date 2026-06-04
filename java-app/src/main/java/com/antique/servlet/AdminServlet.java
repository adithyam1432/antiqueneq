package com.antique.servlet;

import com.antique.dao.AntiqueDAO;
import com.antique.dao.OrderDAO;
import com.antique.model.Antique;
import com.antique.model.Order;
import com.antique.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/admin-dashboard", "/admin-dashboard/*"})
public class AdminServlet extends HttpServlet {
    private final AntiqueDAO antiqueDAO = new AntiqueDAO();
    private final OrderDAO orderDAO = new OrderDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null || !"ADMIN".equals(user.getRole())) {
            resp.sendRedirect(req.getContextPath() + "/home");
            return;
        }

        List<Antique> pendingAntiques = antiqueDAO.getPendingAntiques();
        List<Order> allOrders = orderDAO.getAllOrders();

        req.setAttribute("pendingAntiques", pendingAntiques);
        req.setAttribute("orders", allOrders);
        req.getRequestDispatcher("/admin.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null || !"ADMIN".equals(user.getRole())) {
            resp.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String path = req.getPathInfo();
        if ("/antique-action".equals(path)) {
            String id = req.getParameter("id");
            String status = req.getParameter("status"); // APPROVED or REJECTED
            if (id != null && status != null) {
                antiqueDAO.updateAntiqueStatus(id, status);
            }
        } else if ("/order-action".equals(path)) {
            String id = req.getParameter("id");
            String status = req.getParameter("status"); // CONFIRMED, SHIPPED, DELIVERED, REJECTED
            if (id != null && status != null) {
                orderDAO.updateOrderStatus(id, status);
            }
        }

        resp.sendRedirect(req.getContextPath() + "/admin-dashboard");
    }
}

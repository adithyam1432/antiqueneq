package com.antique.servlet;

import com.antique.dao.OrderDAO;
import com.antique.dao.UserDAO;
import com.antique.model.Order;
import com.antique.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {
    private final OrderDAO orderDAO = new OrderDAO();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User sessionUser = (session != null) ? (User) session.getAttribute("user") : null;

        if (sessionUser == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        if ("ADMIN".equals(sessionUser.getRole())) {
            response.sendRedirect(request.getContextPath() + "/admin-dashboard");
            return;
        }

        // Fetch fresh copy from database to ensure contact & address are current
        User user = userDAO.getUserById(sessionUser.getId());
        List<Order> orders = orderDAO.getOrdersByBuyerId(user.getId());

        // Update session copy if needed
        session.setAttribute("user", user);

        request.setAttribute("user", user);
        request.setAttribute("orders", orders);
        request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User sessionUser = (session != null) ? (User) session.getAttribute("user") : null;

        if (sessionUser == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        String name = request.getParameter("name");
        String contactNumber = request.getParameter("contactNumber");
        String shippingAddress = request.getParameter("shippingAddress");

        if (name == null || name.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/dashboard?error=MissingName");
            return;
        }

        if (userDAO.updateUserProfile(sessionUser.getId(), name, contactNumber, shippingAddress)) {
            response.sendRedirect(request.getContextPath() + "/dashboard?success=ProfileUpdated");
        } else {
            response.sendRedirect(request.getContextPath() + "/dashboard?error=UpdateFailed");
        }
    }
}

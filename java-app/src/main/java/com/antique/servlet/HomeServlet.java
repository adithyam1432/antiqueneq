package com.antique.servlet;

import com.antique.dao.AntiqueDAO;
import com.antique.model.Antique;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/home", "/index"})
public class HomeServlet extends HttpServlet {
    private final AntiqueDAO antiqueDAO = new AntiqueDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Antique> list = antiqueDAO.getAllApprovedAntiques();
        req.setAttribute("antiques", list);
        req.getRequestDispatcher("/index.jsp").forward(req, resp);
    }
}

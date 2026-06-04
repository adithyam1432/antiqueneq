<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antiques | Shopping Cart</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
    <header class="navbar">
        <a href="${pageContext.request.contextPath}/home" class="logo-group">
            <h1>Antiques</h1>
        </a>
        <nav class="nav-links">
            <a href="${pageContext.request.contextPath}/home">Gallery</a>
            <a href="${pageContext.request.contextPath}/cart" class="active">My Cart</a>
            <a href="${pageContext.request.contextPath}/dashboard">My Dashboard</a>
            <span class="user-badge">${sessionScope.user.name}</span>
            <a href="#" onclick="logout(); return false;">Sign Out</a>
        </nav>
    </header>

    <main class="main-container">
        <h2 class="section-title">My Reserved Gallery</h2>
        <p class="section-subtitle">You have secure curator holds on the following pieces.</p>

        <c:choose>
            <c:when test="${empty cartItems}">
                <div class="glass-card text-center" style="padding: 60px 20px;">
                    <p class="text-muted" style="font-size: 18px; margin-bottom: 20px;">Your cart is empty.</p>
                    <a href="${pageContext.request.contextPath}/home" class="btn-premium">Browse Masterpieces</a>
                </div>
            </c:when>
            <c:otherwise>
                <div class="cart-layout">
                    <div class="glass-card" style="padding: 20px 30px;">
                        <c:forEach var="item" items="${cartItems}">
                            <div class="cart-item-row">
                                <img src="${not empty item.productImageUrl ? item.productImageUrl : 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=200'}" alt="${item.productTitle}">
                                <div class="cart-item-details">
                                    <h4>${item.productTitle}</h4>
                                    <p>Qty: ${item.quantity} × ₹${item.productPrice}</p>
                                </div>
                                <form action="${pageContext.request.contextPath}/cart/remove" method="POST">
                                    <input type="hidden" name="itemId" value="${item.id}">
                                    <button type="submit" class="remove-btn">Release Hold</button>
                                </form>
                            </div>
                        </c:forEach>
                    </div>

                    <div class="glass-card" style="height: fit-content;">
                        <h3 class="antique-title" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; margin-bottom: 20px;">Cart Summary</h3>
                        <div class="d-flex justify-between align-center mb-20">
                            <span class="text-muted">Item Subtotal</span>
                            <span style="font-weight:600;">₹${cartTotal}</span>
                        </div>
                        <div class="d-flex justify-between align-center mb-20" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;">
                            <span class="text-muted">Delivery Coordination</span>
                            <span style="color:#2ecc71; font-weight:600;">₹500.00 (Flat)</span>
                        </div>
                        <a href="${pageContext.request.contextPath}/checkout.jsp" class="btn-premium w-100 text-center" style="display:block;">Proceed to Secure Escrow</a>
                    </div>
                </div>
            </c:otherwise>
        </c:choose>
    </main>

    <script>
        async function logout() {
            const res = await fetch('${pageContext.request.contextPath}/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                window.location.href = '${pageContext.request.contextPath}/home';
            }
        }
    </script>
</body>
</html>

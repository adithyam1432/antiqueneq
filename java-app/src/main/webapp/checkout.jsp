<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antiques | Secure Checkout</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        .checkout-container {
            max-width: 600px;
            margin: 0 auto;
        }
        .success-box {
            text-align: center;
            padding: 40px;
        }
    </style>
</head>
<body>
    <header class="navbar">
        <a href="${pageContext.request.contextPath}/home" class="logo-group">
            <h1>Antiques</h1>
        </a>
        <nav class="nav-links">
            <a href="${pageContext.request.contextPath}/home">Gallery</a>
            <a href="${pageContext.request.contextPath}/cart">My Cart</a>
            <a href="${pageContext.request.contextPath}/dashboard">My Dashboard</a>
            <span class="user-badge">${sessionScope.user.name}</span>
            <a href="#" onclick="logout(); return false;">Sign Out</a>
        </nav>
    </header>

    <script>
        async function logout() {
            const res = await fetch('${pageContext.request.contextPath}/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                window.location.href = '${pageContext.request.contextPath}/home';
            }
        }
    </script>

    <main class="main-container">
        <div class="checkout-container">
            <div id="checkout-form-container" class="glass-card">
                <h2 class="section-title" style="font-size:28px; margin-bottom:10px;">Delivery Coordination</h2>
                <p class="text-muted" style="margin-bottom: 25px;">Please confirm details to finalize order escrow hold.</p>

                <div id="error-msg" style="color: #e74c3c; margin-bottom: 15px; text-align: center; display: none;"></div>

                <form id="checkout-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="buyerName" required value="${sessionScope.user.name}">
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="buyerEmail" required value="${sessionScope.user.email}">
                    </div>
                    <div class="form-group">
                        <label>Contact Phone Number</label>
                        <input type="text" id="contact" required placeholder="+91 98765 43210" value="${sessionScope.user.contactNumber}">
                    </div>
                    <div class="form-group">
                        <label>Shipping / Delivery Address</label>
                        <textarea id="shippingAddress" required rows="3" placeholder="123 Luxury Avenue, Karnataka, India"></textarea>
                    </div>
                    <button type="submit" class="btn-premium w-100" style="margin-top: 15px;">Complete Reservation</button>
                </form>
            </div>

            <!-- Success Container with Payment Gateway -->
            <div id="success-container" class="glass-card" style="display: none; padding: 30px;">
                <h2 class="section-title text-center" style="color: var(--gold); font-size:26px; margin-bottom: 10px;">Deposit Payment to Escrow</h2>
                <p class="text-muted text-center" style="font-size:13px; margin-bottom: 25px;">Your reservation is logged. Please scan the QR code to secure the item transaction.</p>
                
                <div style="text-align: center; margin-bottom: 25px;">
                    <svg width="140" height="140" viewBox="0 0 100 100" style="background:#fff; border-radius: 6px; padding: 8px; display:inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                        <rect width="25" height="25" x="10" y="10" fill="#0f172a" />
                        <rect width="13" height="13" x="16" y="16" fill="#fff" />
                        <rect width="25" height="25" x="65" y="10" fill="#0f172a" />
                        <rect width="13" height="13" x="71" y="16" fill="#fff" />
                        <rect width="25" height="25" x="10" y="65" fill="#0f172a" />
                        <rect width="13" height="13" x="16" y="71" fill="#fff" />
                        <rect width="8" height="8" x="45" y="20" fill="#0f172a" />
                        <rect width="8" height="8" x="45" y="45" fill="#0f172a" />
                        <rect width="8" height="8" x="20" y="45" fill="#0f172a" />
                        <rect width="8" height="8" x="65" y="45" fill="#0f172a" />
                        <rect width="8" height="8" x="80" y="65" fill="#0f172a" />
                        <rect width="8" height="8" x="65" y="80" fill="#0f172a" />
                        <rect width="8" height="8" x="45" y="70" fill="#0f172a" />
                    </svg>
                    <p style="font-size:14px; color:var(--gold); font-weight:bold; margin-top:8px;">UPI ID: pay@antiques.escrow</p>
                </div>

                <div id="payment-error" style="color: #e74c3c; margin-bottom: 15px; text-align: center; display: none; font-size:13px;"></div>

                <div style="font-size: 12px; color: #f1c40f; background: rgba(241, 196, 15, 0.08); border: 1px dashed rgba(241, 196, 15, 0.3); padding: 14px 20px; border-radius: 10px; margin-bottom: 20px; text-align: left; line-height: 1.5;">
                    <strong>Important Policy Note:</strong> If this order is delivered and you subsequently wish to return the item, 
                    <strong> 20% of the item cost will be deducted</strong> as a handling fee. The remaining 80% will be 
                    refunded after the item is safely returned to our collection address.
                </div>

                <form id="payment-proof-form" enctype="multipart/form-data">
                    <input type="hidden" name="orderIds" id="orderIdsField">
                    <div class="form-group">
                        <label>Upload Receipt / Transaction Screenshot</label>
                        <input type="file" name="proof" accept="image/*" required style="width:100%; padding:5px;">
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Payment Remarks (Reference ID / Name)</label>
                        <input type="text" name="remarks" placeholder="Reference ID or sender name..." style="width:100%;">
                    </div>
                    <button type="submit" class="btn-premium w-100" style="margin-top: 20px;">Confirm & Submit Receipt</button>
                </form>
            </div>

            <!-- final success screen -->
            <div id="final-success-container" class="glass-card success-box" style="display: none; padding: 40px;">
                <h2 class="section-title" style="color: var(--gold);">Receipt Submitted</h2>
                <h4 style="margin: 15px 0; color: #2ecc71;">✓ Awaiting Escrow Verification</h4>
                <p class="text-muted" style="margin-bottom: 25px;">
                    Thank you. Your transfer receipt has been uploaded and is under audit.
                    You can monitor the shipment progress from your personalized dashboard.
                </p>
                <div style="display:flex; justify-content:center; gap: 15px;">
                    <a href="${pageContext.request.contextPath}/dashboard" class="btn-premium">Go to Dashboard</a>
                    <a href="${pageContext.request.contextPath}/home" class="btn-outline" style="line-height: 40px; height: 40px; padding: 0 20px;">Return Gallery</a>
                </div>
            </div>
        </div>
    </main>

    <script>
        document.getElementById('checkout-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const buyerName = document.getElementById('buyerName').value;
            const buyerEmail = document.getElementById('buyerEmail').value;
            const shippingAddress = document.getElementById('shippingAddress').value;
            
            const errorMsg = document.getElementById('error-msg');
            errorMsg.style.display = 'none';

            try {
                const res = await fetch('${pageContext.request.contextPath}/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ buyerName, buyerEmail, shippingAddress })
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    // Populate order ids
                    document.getElementById('orderIdsField').value = data.orderIds.join(',');
                    document.getElementById('checkout-form-container').style.display = 'none';
                    document.getElementById('success-container').style.display = 'block';
                } else {
                    errorMsg.innerText = data.error || 'Checkout failed';
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = 'Server error occurred. Please try again.';
                errorMsg.style.display = 'block';
            }
        });

        document.getElementById('payment-proof-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const errorMsg = document.getElementById('payment-error');
            errorMsg.style.display = 'none';

            try {
                const res = await fetch('${pageContext.request.contextPath}/api/orders/upload-proof', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    document.getElementById('success-container').style.display = 'none';
                    document.getElementById('final-success-container').style.display = 'block';
                } else {
                    errorMsg.innerText = data.error || 'Failed to submit payment receipt';
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = 'Network connection error. Please try again.';
                errorMsg.style.display = 'block';
            }
        });
    </script>
</body>
</html>

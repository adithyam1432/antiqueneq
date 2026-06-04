<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antiques | Buyer Dashboard</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        .dashboard-layout {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        @media (max-width: 992px) {
            .dashboard-layout {
                grid-template-columns: 1fr;
            }
        }
        .order-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        .order-card:hover {
            border-color: rgba(223, 183, 67, 0.2);
            background: rgba(255, 255, 255, 0.04);
        }
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 12px;
            margin-bottom: 15px;
        }
        .order-body {
            display: flex;
            gap: 20px;
        }
        @media (max-width: 576px) {
            .order-body {
                flex-direction: column;
            }
        }
        .order-img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .order-info {
            flex: 1;
        }
        /* Step tracking styles */
        .step-tracker {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            position: relative;
            padding: 0 10px;
        }
        .step-tracker::before {
            content: '';
            position: absolute;
            top: 12px;
            left: 20px;
            right: 20px;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 1;
        }
        .step-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 2;
            font-size: 10px;
            color: var(--text-muted);
            width: 70px;
            text-align: center;
        }
        .step-bullet {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #1e293b;
            border: 2px solid rgba(255,255,255,0.2);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #fff;
            transition: all 0.3s ease;
        }
        .step-node.active .step-bullet {
            background: var(--gold);
            border-color: var(--gold);
            color: #1e1b0c;
            box-shadow: 0 0 10px rgba(223, 183, 67, 0.4);
        }
        .step-node.active {
            color: var(--gold);
            font-weight: 500;
        }
        .step-node.rejected .step-bullet {
            background: #e74c3c;
            border-color: #e74c3c;
            color: #fff;
            box-shadow: 0 0 10px rgba(231, 76, 60, 0.4);
        }
        .step-node.rejected {
            color: #e74c3c;
            font-weight: 500;
        }
        .qr-section {
            background: rgba(223,183,67,0.03);
            border: 1px dashed rgba(223,183,67,0.2);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            display: flex;
            gap: 15px;
            align-items: center;
        }
        @media (max-width: 576px) {
            .qr-section {
                flex-direction: column;
                text-align: center;
            }
        }
        .alert-bar {
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .alert-success {
            background: rgba(46, 204, 113, 0.15);
            color: #2ecc71;
            border: 1px solid rgba(46, 204, 113, 0.3);
        }
        .alert-error {
            background: rgba(231, 76, 60, 0.15);
            color: #e74c3c;
            border: 1px solid rgba(231, 76, 60, 0.3);
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
            <a href="${pageContext.request.contextPath}/dashboard" class="active">My Dashboard</a>
            <span class="user-badge">${sessionScope.user.name} (BUYER)</span>
            <a href="#" onclick="logout(); return false;">Sign Out</a>
        </nav>
    </header>

    <main class="main-container">
        <h2 class="section-title">Buyer Portal</h2>
        <p class="section-subtitle">Manage shipping details and track order escrow statuses.</p>

        <!-- Message alerts -->
        <c:if test="${param.success eq 'ProfileUpdated'}">
            <div class="alert-bar alert-success">✓ Profile delivery details updated successfully!</div>
        </c:if>
        <c:if test="${param.error eq 'UpdateFailed'}">
            <div class="alert-bar alert-error">✗ Profile update failed. Please try again.</div>
        </c:if>

        <div class="dashboard-layout">
            <!-- Left Side: Profile Coordination -->
            <div class="glass-card">
                <h3 class="antique-title" style="margin-bottom: 20px; color: var(--gold);">Shipping Coordination</h3>
                <form action="${pageContext.request.contextPath}/dashboard" method="POST">
                    <div class="form-group">
                        <label>Curator Name</label>
                        <input type="text" name="name" required value="${user.name}" style="width: 100%;">
                    </div>
                    <div class="form-group">
                        <label>Registered Email</label>
                        <input type="email" value="${user.email}" disabled style="width: 100%; opacity: 0.6; background: rgba(0,0,0,0.2);">
                        <span style="font-size: 10px; color: var(--text-muted);">Account email cannot be modified.</span>
                    </div>
                    <div class="form-group" style="margin-top:10px;">
                        <label>Contact Phone</label>
                        <input type="text" name="contactNumber" value="${user.contactNumber}" placeholder="+91 99999 88888" style="width: 100%;">
                    </div>
                    <div class="form-group">
                        <label>Default Shipping Address</label>
                        <textarea name="shippingAddress" rows="4" placeholder="Enter full address for artifact delivery..." style="width: 100%; background:rgba(15,23,42,0.9); color:#fff; border:1px solid rgba(255,255,255,0.1); padding:10px; border-radius:8px; resize:vertical;">${user.shippingAddress}</textarea>
                    </div>
                    <button type="submit" class="btn-premium" style="width: 100%; margin-top: 15px;">Update Profile Details</button>
                </form>
            </div>

            <!-- Right Side: Orders and Escrow Pipeline -->
            <div>
                <h3 class="antique-title" style="margin-bottom: 20px; color: var(--gold);">Active Escrow Operations</h3>
                <c:choose>
                    <c:when test="${empty orders}">
                        <div class="glass-card text-center" style="padding: 40px;">
                            <p class="text-muted" style="margin-bottom: 20px;">No escrow transactions found under this profile.</p>
                            <a href="${pageContext.request.contextPath}/home" class="btn-premium">Browse Catalog</a>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="order" items="${orders}">
                            <div class="order-card">
                                <div class="order-header">
                                    <div>
                                        <span style="font-size: 11px; color: var(--text-muted);">ORDER ID</span>
                                        <p style="font-size: 13px; font-weight: bold; color:#fff;">${order.id}</p>
                                    </div>
                                    <div style="text-align: right;">
                                        <span style="font-size: 11px; color: var(--text-muted);">ORDER DATE</span>
                                        <p style="font-size: 12px; color: rgba(255,255,255,0.7);">${order.createdAt}</p>
                                    </div>
                                </div>
                                <div class="order-body">
                                    <img src="${order.productImageUrl}" class="order-img" onerror="this.src='https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'">
                                    <div class="order-info">
                                        <h4 style="font-size: 16px; color:#fff; margin-bottom:5px;">${order.productTitle}</h4>
                                        <p style="font-size: 13px; color: var(--gold); font-weight: 600; margin-bottom: 8px;">
                                            Total: ₹${order.totalAmount} <span style="font-weight:450; font-size:11px; color:var(--text-muted);">(incl. delivery)</span>
                                        </p>
                                        <p style="font-size: 12px; color: rgba(255,255,255,0.6);">
                                            <strong>Deliver to:</strong> ${order.shippingAddress}
                                        </p>

                                        <!-- If PENDING and NO proof: Render payment info -->
                                        <c:choose>
                                            <c:when test="${order.status eq 'PENDING' and empty order.proofUrl}">
                                                <div class="qr-section">
                                                    <!-- stylized SVG QR Code -->
                                                    <svg width="70" height="70" viewBox="0 0 100 100" style="background:#fff; border-radius: 4px; padding: 4px; flex-shrink: 0;">
                                                        <rect width="25" height="25" x="10" y="10" fill="#0f172a" />
                                                        <rect width="13" height="13" x="16" y="16" fill="#fff" />
                                                        <rect width="25" height="25" x="65" y="10" fill="#0f172a" />
                                                        <rect width="13" height="13" x="71" y="16" fill="#fff" />
                                                        <rect width="25" height="25" x="10" y="65" fill="#0f172a" />
                                                        <rect width="13" height="13" x="16" y="71" fill="#fff" />
                                                        <!-- random qr elements -->
                                                        <rect width="8" height="8" x="45" y="20" fill="#0f172a" />
                                                        <rect width="8" height="8" x="45" y="45" fill="#0f172a" />
                                                        <rect width="8" height="8" x="20" y="45" fill="#0f172a" />
                                                        <rect width="8" height="8" x="65" y="45" fill="#0f172a" />
                                                        <rect width="8" height="8" x="80" y="65" fill="#0f172a" />
                                                        <rect width="8" height="8" x="65" y="80" fill="#0f172a" />
                                                        <rect width="8" height="8" x="45" y="70" fill="#0f172a" />
                                                    </svg>
                                                    <div style="flex:1;">
                                                        <p style="font-size:11px; font-weight:bold; color:var(--gold); margin-bottom: 2px;">SECURE ESCROW TRANSFER</p>
                                                        <p style="font-size:10px; color:rgba(255,255,255,0.7); margin-bottom: 4px;">UPI ID: <strong>pay@antiques.escrow</strong></p>
                                                        <button class="btn-premium" style="padding: 4px 10px; font-size:10px;" onclick="openProofForm('${order.id}')">Submit Payment Proof</button>
                                                    </div>
                                                </div>
                                            </c:when>
                                            <c:when test="${order.status eq 'PENDING' and not empty order.proofUrl}">
                                                <div style="background: rgba(223,183,67,0.05); border: 1px solid rgba(223,183,67,0.15); border-radius: 6px; padding: 10px; margin-top: 12px; font-size: 11px;">
                                                    <span style="color: var(--gold); font-weight: 500;">✓ Escrow Proof Submitted</span>
                                                    <p class="text-muted" style="margin-top: 4px; font-size:10px;">Our curators are currently auditing the payment transfer. The item is held exclusively for you.</p>
                                                </div>
                                            </c:when>
                                            <c:when test="${order.status eq 'REJECTED'}">
                                                <div style="background: rgba(231,76,60,0.05); border: 1px solid rgba(231,76,60,0.15); border-radius: 6px; padding: 10px; margin-top: 12px; font-size: 11px;">
                                                    <span style="color: #e74c3c; font-weight: 500;">✗ Transaction Rejected</span>
                                                    <p class="text-muted" style="margin-top: 4px; font-size:10px;">The payment audit failed or order was cancelled. Please submit a new proof of payment or register a fresh order.</p>
                                                    <button class="btn-outline" style="padding: 4px 10px; font-size:10px; border-color:#e74c3c; color:#e74c3c; margin-top: 6px;" onclick="openProofForm('${order.id}')">Resubmit Proof</button>
                                                </div>
                                            </c:when>
                                        </c:choose>
                                    </div>
                                </div>

                                <!-- Visual step pipeline tracker -->
                                <div class="step-tracker">
                                    <!-- Determine step index -->
                                    <c:set var="isPending" value="${order.status eq 'PENDING'}" />
                                    <c:set var="isConfirmed" value="${order.status eq 'CONFIRMED'}" />
                                    <c:set var="isPacked" value="${order.status eq 'PACKED'}" />
                                    <c:set var="isDelivering" value="${order.status eq 'DELIVERING'}" />
                                    <c:set var="isShipped" value="${order.status eq 'SHIPPED'}" />
                                    <c:set var="isRejected" value="${order.status eq 'REJECTED'}" />

                                    <c:choose>
                                        <c:when test="${isRejected}">
                                            <div class="step-node active">
                                                <div class="step-bullet">1</div>
                                                Ordered
                                            </div>
                                            <div class="step-node rejected">
                                                <div class="step-bullet">✗</div>
                                                Rejected
                                            </div>
                                        </c:when>
                                        <c:otherwise>
                                            <div class="step-node active">
                                                <div class="step-bullet">1</div>
                                                Ordered
                                            </div>
                                            <div class="step-node ${isConfirmed or isPacked or isDelivering or isShipped ? 'active' : ''}">
                                                <div class="step-bullet">2</div>
                                                Confirmed
                                            </div>
                                            <div class="step-node ${isPacked or isDelivering or isShipped ? 'active' : ''}">
                                                <div class="step-bullet">3</div>
                                                Packed
                                            </div>
                                            <div class="step-node ${isDelivering or isShipped ? 'active' : ''}">
                                                <div class="step-bullet">4</div>
                                                Shipping
                                            </div>
                                            <div class="step-node ${isShipped ? 'active' : ''}">
                                                <div class="step-bullet">5</div>
                                                Delivered
                                            </div>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </main>

    <!-- Escrow Proof Submission Modal -->
    <div id="proofFormModal" class="modal" style="display:none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); justify-content: center; align-items: center;">
        <div class="glass-card" style="max-width: 450px; width: 90%;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:10px; margin-bottom:15px;">
                <h3 style="color:var(--gold);">Escrow Proof Audit</h3>
                <span style="font-size:24px; cursor:pointer;" onclick="closeProofForm()">&times;</span>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <p class="text-muted" style="font-size:12px; margin-bottom:10px;">Scan the QR code below or transfer directly to the UPI handle to secure this masterpiece reservation.</p>
                <svg width="120" height="120" viewBox="0 0 100 100" style="background:#fff; border-radius: 4px; padding: 6px; display:inline-block;">
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
                <p style="font-size:12px; color:var(--gold); font-weight:bold; margin-top:5px;">UPI ID: pay@antiques.escrow</p>
            </div>

            <div id="modal-error" style="color: #e74c3c; font-size:12px; text-align:center; margin-bottom:10px; display:none;"></div>

            <form id="proof-upload-form" enctype="multipart/form-data">
                <input type="hidden" name="orderIds" id="modalOrderId">
                <div class="form-group">
                    <label>Transaction Receipt Screenshot</label>
                    <input type="file" name="proof" accept="image/*" required style="width:100%; padding:5px;">
                </div>
                <div class="form-group" style="margin-top:10px;">
                    <label>Transaction Notes / Reference Remarks</label>
                    <input type="text" name="remarks" placeholder="Reference ID or sender name..." style="width:100%;">
                </div>
                <button type="submit" class="btn-premium" style="width:100%; margin-top:15px;">Submit Transfer Receipt</button>
            </form>
        </div>
    </div>

    <script>
        function openProofForm(orderId) {
            document.getElementById('modalOrderId').value = orderId;
            document.getElementById('modal-error').style.display = 'none';
            document.getElementById('proofFormModal').style.display = 'flex';
        }

        function closeProofForm() {
            document.getElementById('proofFormModal').style.display = 'none';
        }

        document.getElementById('proof-upload-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const errorDiv = document.getElementById('modal-error');
            errorDiv.style.display = 'none';

            try {
                const res = await fetch('${pageContext.request.contextPath}/api/orders/upload-proof', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    closeProofForm();
                    window.location.reload();
                } else {
                    errorDiv.innerText = data.error || 'Failed to upload payment proof.';
                    errorDiv.style.display = 'block';
                }
            } catch (err) {
                errorDiv.innerText = 'Network error during upload.';
                errorDiv.style.display = 'block';
            }
        });

        async function logout() {
            const res = await fetch('${pageContext.request.contextPath}/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                window.location.href = '${pageContext.request.contextPath}/home';
            }
        }
    </script>
</body>
</html>

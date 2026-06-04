<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antiques | Admin Console</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
        }
        .action-cell form {
            display: inline-block;
            margin-right: 8px;
        }
        .admin-nav {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 15px;
            flex-wrap: wrap;
        }
        .admin-nav-item {
            cursor: pointer;
            color: var(--text-muted);
            font-weight: 500;
            padding: 10px 20px;
            border-radius: 8px;
            transition: all 0.3s ease;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
        }
        .admin-nav-item.active {
            background: rgba(223,183,67,0.15);
            color: var(--gold);
            border-color: rgba(223,183,67,0.3);
        }
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        @media (max-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr;
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
        .proof-thumbnail {
            max-width: 80px;
            max-height: 80px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.1);
            cursor: pointer;
            transition: transform 0.2s;
        }
        .proof-thumbnail:hover {
            transform: scale(1.05);
        }
        /* Modal styling */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.85);
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            max-width: 90%;
            max-height: 85%;
            border: 2px solid var(--gold);
            border-radius: 8px;
        }
        .modal-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #fff;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <header class="navbar">
        <a href="${pageContext.request.contextPath}/home" class="logo-group">
            <h1>Antiques Control Console</h1>
        </a>
        <nav class="nav-links">
            <a href="${pageContext.request.contextPath}/home">Gallery</a>
            <span class="user-badge">${sessionScope.user.name} (ADMIN)</span>
            <a href="#" onclick="logout(); return false;">Sign Out</a>
        </nav>
    </header>

    <main class="main-container">
        <h2 class="section-title">Admin Console</h2>
        <p class="section-subtitle">Manage system collections, catalog, and order verifications.</p>

        <!-- Notification alerts -->
        <c:if test="${param.success eq 'ProductAdded'}">
            <div class="alert-bar alert-success">✓ Antique item listed successfully in catalog!</div>
        </c:if>
        <c:if test="${param.error eq 'DbInsertFailed'}">
            <div class="alert-bar alert-error">✗ Database write failure while inserting antique item.</div>
        </c:if>
        <c:if test="${param.error eq 'InvalidPrice'}">
            <div class="alert-bar alert-error">✗ The price entered was invalid. Please enter a valid decimal number.</div>
        </c:if>

        <div class="admin-nav">
            <span class="admin-nav-item active" id="tab-add-product" onclick="switchTab('add-product')">List New Antique</span>
            <span class="admin-nav-item" id="tab-orders" onclick="switchTab('orders')">Sales & Orders</span>
            <span class="admin-nav-item" id="tab-antiques" onclick="switchTab('antiques')">Catalog Inventory</span>
        </div>

        <div class="dashboard-grid">
            <!-- 1. Add Product Panel -->
            <div id="panel-add-product" class="glass-card">
                <h3 class="antique-title" style="margin-bottom: 20px; color: var(--gold);">List a New Antique Artifact</h3>
                <form action="${pageContext.request.contextPath}/admin-dashboard/add-product" method="POST" enctype="multipart/form-data">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Product Name / Title</label>
                            <input type="text" name="title" required placeholder="e.g. Mughal Gold Astrolabe" style="width:100%;">
                        </div>
                        <div class="form-group">
                            <label>Price (in INR)</label>
                            <input type="number" step="0.01" name="price" required placeholder="e.g. 150000" style="width:100%;">
                        </div>
                    </div>
                    <div class="form-grid" style="margin-top: 15px;">
                        <div class="form-group">
                            <label>Category</label>
                            <select name="category" style="width:100%; background:rgba(15,23,42,0.9); color:#fff; border:1px solid rgba(255,255,255,0.1); padding:10px; border-radius:8px;">
                                <option value="Ceramics">Ceramics</option>
                                <option value="Horology">Horology</option>
                                <option value="Fine Art">Fine Art</option>
                                <option value="Scientific">Scientific</option>
                                <option value="Sculpture">Sculpture</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Collectibles">Collectibles</option>
                                <option value="Metalware">Metalware</option>
                                <option value="Textiles">Textiles</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Artifact Photo Upload</label>
                            <input type="file" name="image" accept="image/*" required style="width:100%; padding:5px;">
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Comprehensive Historical Description</label>
                        <textarea name="description" rows="4" required placeholder="Describe the origin, period, material, and condition..." style="width:100%; background:rgba(15,23,42,0.9); color:#fff; border:1px solid rgba(255,255,255,0.1); padding:10px; border-radius:8px; resize:vertical;"></textarea>
                    </div>
                    <button type="submit" class="btn-premium" style="margin-top: 20px; width: 220px;">Publish to Catalog</button>
                </form>
            </div>

            <!-- 2. Orders Panel -->
            <div id="panel-orders" class="glass-card" style="display: none;">
                <h3 class="antique-title" style="margin-bottom: 20px; color: var(--gold);">Sales and Escrow Pipeline</h3>
                <c:choose>
                    <c:when test="${empty orders}">
                        <p class="text-muted text-center" style="padding:20px;">No transaction records found.</p>
                    </c:when>
                    <c:otherwise>
                        <div class="table-responsive">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order Details</th>
                                        <th>Buyer Details</th>
                                        <th>Proof & Remarks</th>
                                        <th>Status</th>
                                        <th>Fulfillment Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="order" items="${orders}">
                                        <tr>
                                            <td>
                                                <p style="font-weight:600; font-size:13px; color: #fff;">${order.productTitle}</p>
                                                <span style="font-size:11px; color:var(--text-muted);">Order ID: ${order.id}</span><br>
                                                <span style="font-size:11px; color:var(--gold);">Amount: ₹${order.totalAmount}</span>
                                            </td>
                                            <td>
                                                <p style="font-size:13px; font-weight:500;">${order.buyerName}</p>
                                                <span style="font-size:11px; color:var(--text-muted);">${order.buyerEmail}</span><br>
                                                <span style="font-size:11px; color:rgba(255,255,255,0.6);">Address: ${order.shippingAddress}</span>
                                            </td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${not empty order.proofUrl}">
                                                        <img src="${pageContext.request.contextPath}/${order.proofUrl}" class="proof-thumbnail" onclick="viewProof('${pageContext.request.contextPath}/${order.proofUrl}')" title="Click to view payment proof">
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span style="font-size:11px; color:#e74c3c; font-style:italic;">No proof uploaded</span>
                                                    </c:otherwise>
                                                </c:choose>
                                                <c:if test="${not empty order.remarks}">
                                                    <div style="font-size:11px; margin-top:5px; color:#c5a059; max-width: 180px; word-wrap: break-word;">
                                                        <strong>Remarks:</strong> "${order.remarks}"
                                                    </div>
                                                </c:if>
                                            </td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${order.status eq 'PENDING'}">
                                                        <span class="status-badge status-pending">Awaiting Verification</span>
                                                    </c:when>
                                                    <c:when test="${order.status eq 'CONFIRMED'}">
                                                        <span class="status-badge status-approved">Confirmed</span>
                                                    </c:when>
                                                    <c:when test="${order.status eq 'PACKED'}">
                                                        <span class="status-badge" style="background: rgba(52, 152, 219, 0.15); color: #3498db;">Packed</span>
                                                    </c:when>
                                                    <c:when test="${order.status eq 'DELIVERING'}">
                                                        <span class="status-badge" style="background: rgba(155, 89, 182, 0.15); color: #9b59b6;">Delivering</span>
                                                    </c:when>
                                                    <c:when test="${order.status eq 'SHIPPED'}">
                                                        <span class="status-badge status-sold">Shipped & Closed</span>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="status-badge status-rejected">${order.status}</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td class="action-cell">
                                                <c:choose>
                                                    <c:when test="${order.status eq 'PENDING'}">
                                                        <c:choose>
                                                            <c:when test="${not empty order.proofUrl}">
                                                                <form action="${pageContext.request.contextPath}/admin-dashboard/order-action" method="POST">
                                                                    <input type="hidden" name="id" value="${order.id}">
                                                                    <input type="hidden" name="status" value="CONFIRMED">
                                                                    <button type="submit" class="btn-premium" style="padding: 6px 10px; font-size:11px; margin-bottom: 4px;">Accept Proof</button>
                                                                </form>
                                                                <form action="${pageContext.request.contextPath}/admin-dashboard/order-action" method="POST">
                                                                    <input type="hidden" name="id" value="${order.id}">
                                                                    <input type="hidden" name="status" value="REJECTED">
                                                                    <button type="submit" class="btn-outline" style="padding: 6px 10px; font-size:11px; border-color:#e74c3c; color:#e74c3c;">Reject</button>
                                                                </form>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span style="font-size:11px; color:#e67e22; font-style:italic;">Awaiting Payment Proof</span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </c:when>
                                                    <c:when test="${order.status eq 'CONFIRMED'}">
                                                        <form action="${pageContext.request.contextPath}/admin-dashboard/order-action" method="POST">
                                                            <input type="hidden" name="id" value="${order.id}">
                                                            <input type="hidden" name="status" value="PACKED">
                                                            <button type="submit" class="btn-premium" style="padding: 6px 10px; font-size:11px; background:#3498db;">Mark Packed</button>
                                                        </form>
                                                    </c:when>
                                                    <c:when test="${order.status eq 'PACKED'}">
                                                        <form action="${pageContext.request.contextPath}/admin-dashboard/order-action" method="POST">
                                                            <input type="hidden" name="id" value="${order.id}">
                                                            <input type="hidden" name="status" value="DELIVERING">
                                                            <button type="submit" class="btn-premium" style="padding: 6px 10px; font-size:11px; background:#9b59b6;">Dispatch Order</button>
                                                        </form>
                                                    </c:when>
                                                    <c:when test="${order.status eq 'DELIVERING'}">
                                                        <form action="${pageContext.request.contextPath}/admin-dashboard/order-action" method="POST">
                                                            <input type="hidden" name="id" value="${order.id}">
                                                            <input type="hidden" name="status" value="SHIPPED">
                                                            <button type="submit" class="btn-premium" style="padding: 6px 10px; font-size:11px; background:#2ecc71;">Complete Delivery</button>
                                                        </form>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span style="font-size:12px; color:var(--text-muted);">Fully Processed</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>

            <!-- 3. Catalog Inventory Panel -->
            <div id="panel-antiques" class="glass-card" style="display: none;">
                <h3 class="antique-title" style="margin-bottom: 20px; color: var(--gold);">Catalog & Inventory Management</h3>
                <c:choose>
                    <c:when test="${empty pendingAntiques}">
                        <!-- Reuse pendingAntiques or show message, wait. We fetch all approved antiques in HomeServlet, but for admin we passed pendingAntiques. Let's make sure the admin can also view approved or we fetch them all in AdminServlet. Let's make it show what's loaded. -->
                        <p class="text-muted text-center" style="padding:20px;">No pending approvals, view gallery to see all live catalog items.</p>
                    </c:when>
                    <c:otherwise>
                        <div class="table-responsive">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Item Title</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="item" items="${pendingAntiques}">
                                        <tr>
                                            <td><strong>${item.title}</strong></td>
                                            <td>₹${item.price}</td>
                                            <td>${item.category}</td>
                                            <td class="action-cell">
                                                <form action="${pageContext.request.contextPath}/admin-dashboard/antique-action" method="POST">
                                                    <input type="hidden" name="id" value="${item.id}">
                                                    <input type="hidden" name="status" value="APPROVED">
                                                    <button type="submit" class="btn-premium" style="padding: 6px 12px; font-size:12px;">Approve Listing</button>
                                                </form>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </main>

    <!-- Photo proof preview modal -->
    <div id="proofModal" class="modal" onclick="closeModal()">
        <span class="modal-close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="imgModalTarget">
    </div>

    <script>
        function switchTab(tab) {
            document.getElementById('tab-add-product').classList.remove('active');
            document.getElementById('tab-orders').classList.remove('active');
            document.getElementById('tab-antiques').classList.remove('active');
            
            document.getElementById('panel-add-product').style.display = 'none';
            document.getElementById('panel-orders').style.display = 'none';
            document.getElementById('panel-antiques').style.display = 'none';

            if (tab === 'add-product') {
                document.getElementById('tab-add-product').classList.add('active');
                document.getElementById('panel-add-product').style.display = 'block';
            } else if (tab === 'orders') {
                document.getElementById('tab-orders').classList.add('active');
                document.getElementById('panel-orders').style.display = 'block';
            } else {
                document.getElementById('tab-antiques').classList.add('active');
                document.getElementById('panel-antiques').style.display = 'block';
            }
        }

        function viewProof(url) {
            document.getElementById('imgModalTarget').src = url;
            document.getElementById('proofModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('proofModal').style.display = 'none';
        }

        async function logout() {
            const res = await fetch('${pageContext.request.contextPath}/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                window.location.href = '${pageContext.request.contextPath}/home';
            }
        }
    </script>
</body>
</html>

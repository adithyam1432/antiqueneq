<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antiques Admin Portal | Secure Gateway</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        body {
            background-color: #0b0f19;
            color: #f1f5f9;
        }
        .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
        }
        .auth-card {
            max-width: 450px;
            width: 100%;
            border: 1px solid rgba(212, 175, 55, 0.3);
            background: rgba(15, 23, 42, 0.85);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .auth-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .auth-header h2 {
            color: var(--gold);
            text-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
        }
        .form-group label {
            color: rgba(255, 255, 255, 0.8);
        }
        .form-group input {
            background: rgba(11, 15, 25, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }
        .form-group input:focus {
            border-color: var(--gold);
            box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
        }
        .btn-premium {
            background: linear-gradient(135deg, #c5a059 0%, #b2893c 100%);
            border: none;
            color: #0f172a;
            font-weight: 700;
        }
        .btn-premium:hover {
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <header class="navbar" style="background: rgba(11, 15, 25, 0.9); border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
        <a href="${pageContext.request.contextPath}/home" class="logo-group">
            <h1 style="color: var(--gold);">Antiques</h1>
            <span style="font-size: 11px; letter-spacing: 2px; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-left: 10px;">Security Gateway</span>
        </a>
    </header>

    <main class="main-container auth-container">
        <div class="glass-card auth-card">
            <div class="auth-header">
                <h2 class="section-title" style="font-size:26px;">Portal Verification</h2>
                <p class="text-muted" style="color: rgba(255,255,255,0.6) !important;">Restricted Administrative Challenge Protocol.</p>
            </div>

            <div id="error-msg" style="color: #ef4444; margin-bottom: 15px; text-align: center; display: none; font-weight: 600;"></div>

            <form id="admin-login-form">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="email" required placeholder="admin@antiques.com" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required placeholder="••••••••" autocomplete="off">
                </div>
                <button type="submit" class="btn-premium w-100" style="margin-top: 15px;">Authenticate Gateway</button>
            </form>
        </div>
    </main>

    <script>
        document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-msg');
            errorMsg.style.display = 'none';

            try {
                const res = await fetch('${pageContext.request.contextPath}/api/auth/admin-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    window.location.href = '${pageContext.request.contextPath}/admin-dashboard';
                } else {
                    errorMsg.innerText = data.error || 'Challenge rejected. Invalid credentials.';
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = 'Failed to execute administrative verification handshake.';
                errorMsg.style.display = 'block';
            }
        });
    </script>
</body>
</html>

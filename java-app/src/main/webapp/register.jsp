<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antiques | Register Account</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
        }
        .auth-card {
            max-width: 450px;
            width: 100%;
        }
        .auth-header {
            text-align: center;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <header class="navbar">
        <a href="${pageContext.request.contextPath}/home" class="logo-group">
            <h1>Antiques</h1>
        </a>
    </header>

    <main class="main-container auth-container">
        <div class="glass-card auth-card">
            <div class="auth-header">
                <h2 class="section-title" style="font-size:28px;">Create Account</h2>
                <p class="text-muted">Join India's elite antique network.</p>
            </div>

            <div id="error-msg" style="color: #e74c3c; margin-bottom: 15px; text-align: center; display: none;"></div>
            <div id="success-msg" style="color: #2ecc71; margin-bottom: 15px; text-align: center; display: none;"></div>

            <form id="register-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="name" required placeholder="Adithya M">
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="email" required placeholder="adithya@example.com">
                </div>
                <div class="form-group">
                    <label>Contact Number</label>
                    <input type="text" id="contact" required placeholder="+91 98765 43210">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required placeholder="••••••••" minlength="6">
                </div>
                <button type="submit" class="btn-premium w-100" style="margin-top: 15px;">Register</button>
            </form>

            <div style="margin-top: 25px; text-align: center; font-size: 14px;">
                <p class="text-muted">Already have an account? <a href="${pageContext.request.contextPath}/login.jsp" style="color: var(--gold); text-decoration: none;">Sign In</a></p>
            </div>
        </div>
    </main>

    <script>
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const contact_number = document.getElementById('contact').value;
            const password = document.getElementById('password').value;

            const errorMsg = document.getElementById('error-msg');
            const successMsg = document.getElementById('success-msg');
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';

            try {
                const res = await fetch('${pageContext.request.contextPath}/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, contact_number, password })
                });

                const data = await res.json();
                if (res.ok) {
                    successMsg.innerText = data.message || 'Account registered successfully! Redirecting...';
                    successMsg.style.display = 'block';
                    setTimeout(() => {
                        window.location.href = '${pageContext.request.contextPath}/login.jsp';
                    }, 2000);
                } else {
                    errorMsg.innerText = data.error || 'Registration failed';
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = 'Server error occurred. Please try again.';
                errorMsg.style.display = 'block';
            }
        });
    </script>
</body>
</html>

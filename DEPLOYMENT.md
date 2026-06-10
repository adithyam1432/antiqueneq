# AntiQues Deployment Guide

This guide details the steps required to deploy the **AntiQues** Next.js application to **Vercel** and connect it to a production database.

## Prerequisites
1. **GitHub Repository**: Pushed and up-to-date at `https://github.com/adithyam1432/antiqueneq.git` (Completed).
2. **Production MySQL Database**: Since Vercel is a serverless platform, it cannot host a local MySQL database. You need a cloud-hosted MySQL database. You can set up a MySQL database on platforms such as:
   - **Railway** (railway.app)
   - **Aiven** (aiven.io)
   - **Clever Cloud** (clever-cloud.com)
   - **Tidb Cloud** (pingcap.com)

---

## Step 1: Set Up & Seed the Cloud Database
1. Create a MySQL database instance on your chosen cloud provider.
2. Retrieve the connection credentials:
   - **Host** (e.g., `mysql.railway.internal` or a public IP/domain)
   - **Port** (usually `3306`)
   - **Database Name** (e.g., `antiques_db`)
   - **Username**
   - **Password**
3. Run the SQL schema script located in `src/lib/schema.sql` against your cloud database using a database client (like **DBeaver**, **MySQL Workbench**, or the cloud provider's console) to initialize the tables:
   - `users`
   - `antiques`
   - `orders`
   - `cart_items`
4. Run the seed script in `src/lib/seed.sql` to populate the initial antiques listings, category configs, and default administrator credentials.

---

## Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/) and log in (using your GitHub account).
2. Click **Add New...** -> **Project**.
3. Import the `antiqueneq` repository.
4. In the **Configure Project** screen:
   - Keep default Build and Output Settings (the Next.js preset is automatically configured).
   - Expand the **Environment Variables** section.

---

## Step 3: Configure Environment Variables in Vercel
Add the following key-value pairs under **Environment Variables**:

| Variable Name | Value / Example |
|---|---|
| `NEXTAUTH_SECRET` | A secure, random 32+ character string (e.g. `your-super-secret-key-that-is-at-least-32-chars-long`) |
| `NEXTAUTH_URL` | Your production Vercel deployment URL (e.g., `https://antiqueneq.vercel.app`) |
| `MYSQL_HOST` | Host address of your cloud MySQL database |
| `MYSQL_PORT` | Port of your cloud MySQL database (e.g., `23456` or `3306`) |
| `MYSQL_USER` | Username for your cloud MySQL database |
| `MYSQL_PASSWORD` | Password for your cloud MySQL database |
| `MYSQL_DATABASE` | Database name (e.g., `defaultdb` or `antiques_db`) |
| `MYSQL_SSL` | Set to `true` to enable secure SSL connections (required for Aiven) |
| `SMTP_HOST` | SMTP server host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g., `587`) |
| `SMTP_USER` | SMTP email address (e.g., `aditya587644@gmail.com`) |
| `SMTP_PASSWORD` | App password/SMTP password (e.g., `Adithya4@300602`) |
| `EMAIL_FROM` | Sender email address (e.g., `aditya587644@gmail.com`) |

---

## Step 4: Deploy and Verify
1. Click **Deploy**.
2. Vercel will build and launch your application, providing a production domain.
3. Open the production URL, register a new buyer account, and verify that registration, login, and dashboard functionalities connect correctly to your cloud database.

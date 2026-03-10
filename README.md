# 🍔 FoodHub - Multiple Restaurant Ordering Platform

Welcome to **FoodHub**! This is a full‑stack multiple‑restaurant food ordering platform with:

- A modern, animated React frontend 🎨  
- A secure Spring Boot + MongoDB backend 🔐  
- Cloud database connectivity via MongoDB Atlas ☁️  

It’s designed to give users a smooth, fun experience discovering restaurants and placing orders, while giving restaurant owners a simple way to manage their presence.

---

## ✨ Main Features

- **Modern & Animated UI** 💫  
  Smooth page transitions and micro‑animations powered by **Framer Motion** for a polished user experience.

- **Multiple Restaurant Browsing** 🍽️  
  View curated restaurant lists with name, cuisine, rating, delivery time, and price from the backend API.

- **Cuisine Discovery** 🌎  
  Explore Indian, Chinese, Mexican, Italian, Japanese and more with visually rich cards.

- **Authentication (Signup + Login)** 🔑  
  Users can sign up and log in using email/password. Passwords are securely hashed in MongoDB using **BCrypt**.

- **Role‑Based Flows** 👥  
  Users can sign up as **customer** or **restaurant_owner`, allowing future role‑specific dashboards and features.

- **Dark Mode** 🌓  
  Global theme toggle using a custom **ThemeContext**, so users can switch between light and dark.

- **Cart & Ordering Flow (UI)** 🛒  
  Frontend cart and ordering flow wired to context, ready to be connected to more advanced backend logic.

- **Responsive Design** 📱💻  
  Tailwind CSS ensures the app looks great on mobile, tablet, and desktop.

---

## 🧩 Tech Stack & What Each Part Does

### Frontend 🖥️

- **React 18**  
  Component‑based UI library for building interactive pages and stateful components.

- **Vite** ⚡  
  Fast dev server and bundler for instant feedback and optimized builds.

- **Tailwind CSS** 🎨  
  Utility‑first CSS for rapid styling with responsive and dark‑mode classes.

- **Framer Motion**  
  Handles the smooth animations on hero sections, cards, and page transitions.

- **React Router**  
  Manages client‑side routing between pages like Home, Login, Signup, Owner Dashboard, etc.

- **Context APIs**  
  - `AuthContext` – stores logged‑in user info (id, role, email) and login/logout helpers.  
  - `ThemeContext` – controls light/dark mode across the app.

- **Lucide Icons**  
  Provides clean, modern icons for form inputs and navigation.

### Backend ⚙️

- **Spring Boot 3**  
  Java framework powering the REST API, controllers, validation, and application startup.

- **MongoDB + Spring Data MongoDB** 🍃  
  - Models: `User`, `Restaurant` (stored as documents).  
  - Repositories: `UserRepository`, `RestaurantRepository` for easy CRUD operations.  
  - Cloud DB: connected via **MongoDB Atlas** using a connection string in `application.properties`.

- **Authentication & Security** 🔒  
  - `AuthController` exposes `/api/auth/signup` and `/api/auth/login`.  
  - Uses **BCryptPasswordEncoder** to hash passwords before saving to MongoDB.  
  - Basic validation with Jakarta Validation annotations (`@Email`, `@NotBlank`, `@Size`).

- **CORS Configuration** 🌐  
  - `WebConfig` globally allows the frontend origin `http://localhost:5173` to call the backend API.  
  - Handles preflight `OPTIONS` requests and allows credentials/methods/headers.

- **Health & Utility Endpoints** ❤️  
  - `HealthController` → `/api/health` to confirm backend status.  
  - `WelcomeController` → `/` with quick links to main routes.  
  - `GlobalErrorController` → `/error` to give friendly messages for unknown paths.

---

## 🧑‍💻 How To Run The Project Locally

### 1. Prerequisites

Make sure you have:

- [Node.js](https://nodejs.org/) (v16+ recommended)  
- [npm](https://www.npmjs.com/) (comes with Node)  
- [Java 17+](https://adoptium.net/) (project currently runs on Java 25 in dev logs)  
- A free [MongoDB Atlas](https://www.mongodb.com/atlas/database) cluster (or update the connection string accordingly)

---

### 2. Clone The Repository

```bash
git clone <repository-url>
cd "Multiple Restaurant Site"
```

---

### 3. Configure Backend (Spring Boot + MongoDB Atlas) 🔧

1. Open `backend/src/main/resources/application.properties`  
2. Make sure your MongoDB Atlas URI is set, for example:

   ```properties
   server.port=8080
   spring.data.mongodb.uri=mongodb+srv://<user>:<password>@cluster0.your-id.mongodb.net/foodhub?retryWrites=true&w=majority&appName=Cluster0
   ```

3. Ensure your Atlas user, password, and database name (`foodhub`) are correct.

4. From the project root:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

   Backend runs at: `http://localhost:8080` 🚀  

Key backend endpoints:

- `GET /` – basic welcome + links  
- `GET /api/health` – health check  
- `GET /api/restaurants` – restaurant list  
- `POST /api/auth/signup` – user signup  
- `POST /api/auth/login` – user login  

---

### 4. Run Frontend (React + Vite) 🎯

In a second terminal:

```bash
cd "Multiple Restaurant Site/frontend"
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

The app is already configured to talk to the backend at `http://localhost:8080` with CORS enabled, so signup and login should work when both servers are running.

---

## 📜 Frontend Scripts

Inside the `frontend` directory, you can run:

- `npm run dev` – 🚀 Start the development server with hot‑reload.  
- `npm run build` – 📦 Build the app for production into `dist`.  
- `npm run lint` – 🔍 Lint the code to catch common issues.  
- `npm run preview` – 🌐 Preview the production build locally.

---

## ✅ How Users Benefit

- **Fast discovery** – Quickly browse restaurants and cuisines in a clean, responsive UI.  
- **Smooth experience** – Animations and dark mode make the app feel modern and enjoyable.  
- **Secure accounts** – Passwords are hashed and stored securely in MongoDB Atlas.  
- **Cloud‑ready** – Backend and database are ready to be deployed to cloud platforms.  
- **Extendable** – Clear separation of frontend and backend makes it easy to add features like orders, payments, and owner dashboards in the future. ✨

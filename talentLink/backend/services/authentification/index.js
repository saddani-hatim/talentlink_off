import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./src/config/passport.js";
import authRoutes from "./src/routes/auth.routes.js";
import companyRoutes from "../company/src/routes/company.routes.js";

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 2020;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  })
);
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Error Handling
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Une erreur interne est survenue",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Service d'Authentification démarré sur le port ${PORT}`);
  console.log("Service reloaded at " + new Date().toISOString());
  console.log("GitHub Client ID loaded: ", process.env.GITHUB_CLIENT_ID ? "YES" : "NO");
});


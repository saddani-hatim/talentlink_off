import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import companyRoutes from "./src/routes/company.routes.js";

const app = express();
const PORT = process.env.COMPANY_SERVICE_PORT || 2023;

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

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/company", companyRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error in Company Service" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Company Service started on port ${PORT}`);
  console.log("Service reloaded at " + new Date().toISOString());
});

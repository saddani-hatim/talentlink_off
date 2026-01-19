import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKeyPath = path.join(
  __dirname,
  "../../../../",
  process.env.JWT_PUBLIC_KEY_PATH || "key/key_new.pub"
);
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    
    // Role check
    if (decoded.role !== 'COMPANY') {
      return res.status(403).json({
        success: false,
        message: "Access denied: Company role required"
      });
    }

    // Map id to userId for compatibility with controller
    req.user = { ...decoded, userId: decoded.id };
    console.log("AUTH OK:", { userId: req.user.userId, role: req.user.role });
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;

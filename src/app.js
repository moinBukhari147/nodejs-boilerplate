// =========================================
//             Lbraries Import
// =========================================
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import path from 'path';

// =========================================
//             Code Import
// =========================================
import { nodeEnv, port } from "./config/initial.config.js";
import { connectDB } from "./config/db.config.js";
import { getIPAddress } from "./utils/utils.js";
import "./models/models.js";
import authRoutes from "./routes/auth/auth.route.js";
// import oAuthRoutes from "./routes/auth/oAuth.route.js";


// =========================================
//            Configurations
// =========================================
// Initializing the app
const app = express();
app.use(cookieParser());

// Essential security headers with Helmet
app.use(helmet());

// Enable CORS with default settings
const crosOptions = {
  origin: nodeEnv === 'production' ? domain : '*',                                // allow requests from all ips in development, and use array for multiple domains
  // allowedHeaders: ['Content-Type', 'Authorization', 'x-token', 'y-token'],    // allow these custom headers only
};
app.use(cors(crosOptions));

// Logger middleware for development environment
if (nodeEnv !== "production") {
  app.use(morgan("dev"));
}

// Compress all routes
app.use(compression());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Built-in middleware for parsing JSON
app.use(express.json());

// static directories
// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, '..', 'static')));

// =========================================
//            Routes
// =========================================
// Route for root path
app.get('/', (req, res) => {
  res.send("Welcome to Boiler plate");
});

// Use authentication routes
app.use("/api/auth", authRoutes);
// app.use("/api/oauth", oAuthRoutes);      // UNCOMMENT THIS, OAUTH ROUTES,CONTOLLERS AND CONFIGURE TO USE OAUTH

// other routes


// =========================================
//            Global Error Handler
// =========================================
// Global error handler
app.use((err, req, res, next) => {
  if (err.code === "UNSUPPORTED_FILE_FORMAT") return validationError(res, err.message, err.field);
  if (err.code === "LIMIT_FILE_SIZE") return validationError(res, "File size should not be greater than 10MB", err.field);
  console.error(chalk.red(err.stack));
  return catchError(res, err);
});



// Database connection
connectDB();


// Server running
app.listen(port, () => {
  console.log(chalk.bgYellow.bold(` Server is listening at http://${getIPAddress()}:${port} `));
});
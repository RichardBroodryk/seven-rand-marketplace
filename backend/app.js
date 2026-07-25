const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/searchRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const qualityRoutes = require("./routes/qualityRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const savedSearchRoutes = require("./routes/savedSearchRoutes");
const contactRoutes = require("./routes/contactRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// ✅ Complete CORS configuration (FIXED - no wildcard)
const corsOptions = {
  origin: [
    "https://seven-rand-marketplace-frontend.onrender.com",
    "http://localhost:5173",
    "https://seven-rand-marketplace.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (req, res) => {
  res.json({
    application: "Seven Rand Marketplace API",
    status: "Running",
  });
});

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quality", qualityRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/saved-searches", savedSearchRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

module.exports = app;
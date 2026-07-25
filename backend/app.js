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

// ✅ SIMPLE CORS - Works everywhere
app.use(cors());
app.options("*", cors());

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
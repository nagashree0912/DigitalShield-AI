require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createClient } = require("@supabase/supabase-js");
const scanRoutes = require("./src/routes/scans");
const brandRoutes = require("./src/routes/brands");
const itemRoutes = require("./src/routes/items");
const { requireSupabase } = require("./src/middleware/supabase");

const app = express();
const port = Number(process.env.PORT || 5000);
app.use(helmet());
app.use(cors({ origin: (process.env.FRONTEND_ORIGIN || "http://localhost:3000").split(",").map(x => x.trim()) }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("tiny"));

const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = configured
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;
app.locals.supabase = supabase;
app.locals.supabaseConfigured = configured;

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "DigitalShield AI API",
    database: configured ? "configured" : "not_configured",
    providers: {
      googleSafeBrowsing: Boolean(process.env.GOOGLE_SAFE_BROWSING_API_KEY),
      virusTotal: Boolean(process.env.VIRUSTOTAL_API_KEY),
      youtube: Boolean(process.env.YOUTUBE_API_KEY),
      x: Boolean(process.env.X_BEARER_TOKEN)
    },
    note: "Health status does not mean that a threat scan has been run."
  });
});
app.use("/api/scans", requireSupabase, scanRoutes);
app.use("/api/brands", requireSupabase, brandRoutes);
app.use("/api/items", requireSupabase, itemRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found." }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});
app.listen(port, () => console.log(`DigitalShield AI API listening on http://localhost:${port}`));

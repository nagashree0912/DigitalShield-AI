const express = require("express");
const { z } = require("zod");
const router = express.Router();

const scanSchema = z.object({
  brand_id: z.string().uuid().optional().nullable(),
  input_type: z.enum(["url", "message", "payment", "screenshot", "qr"]),
  input_value: z.string().min(1).max(10000),
  source: z.string().max(100).optional().default("user_submission")
});

// This endpoint records submitted scan requests. It deliberately does not claim to
// verify a URL unless an actual reputation provider has been configured and called.
router.post("/", async (req, res, next) => {
  try {
    const parsed = scanSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid scan request.", details: parsed.error.flatten() });
    const row = {
      brand_id: parsed.data.brand_id || null,
      input_type: parsed.data.input_type,
      input_value: parsed.data.input_value,
      source: parsed.data.source,
      status: "submitted",
      verdict: "unverified",
      evidence: [],
      provider_status: { message: "No threat-intelligence provider was queried by this endpoint." }
    };
    const { data, error } = await req.app.locals.supabase.from("scans").insert(row).select().single();
    if (error) return next(error);
    res.status(201).json({ scan: data, message: "Scan request stored. Threat verification is not configured by this endpoint." });
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
    let query = req.app.locals.supabase.from("scans").select("*").order("created_at", { ascending: false }).limit(limit);
    if (req.query.brand_id) query = query.eq("brand_id", req.query.brand_id);
    const { data, error } = await query;
    if (error) return next(error);
    res.json({ scans: data || [] });
  } catch (e) { next(e); }
});

module.exports = router;

const express = require("express");
const { z } = require("zod");
const router = express.Router();

const brandSchema = z.object({
  name: z.string().min(2).max(160),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().max(120).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  official_social_urls: z.array(z.string().url()).max(50).optional().default([]),
  official_app_ids: z.array(z.string().max(250)).max(50).optional().default([])
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = brandSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid brand profile.", details: parsed.error.flatten() });
    const { data, error } = await req.app.locals.supabase.from("brands").insert(parsed.data).select().single();
    if (error) return next(error);
    res.status(201).json({ brand: data });
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await req.app.locals.supabase.from("brands").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) return next(error);
    res.json({ brands: data || [] });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { data, error } = await req.app.locals.supabase.from("brands").select("*").eq("id", req.params.id).single();
    if (error) return next(error);
    res.json({ brand: data });
  } catch (e) { next(e); }
});

module.exports = router;

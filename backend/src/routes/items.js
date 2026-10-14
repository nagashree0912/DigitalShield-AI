const express = require("express");
const { z } = require("zod");
const router = express.Router();

const itemSchema = z.object({
  type: z.string().min(1).max(80).default("Finding"),
  name: z.string().trim().min(1).max(200),
  target: z.string().trim().min(1).max(2000),
  risk: z.enum(["Unverified", "Low", "Medium", "High"]).default("Unverified"),
  description: z.string().max(4000).optional().default(""),
  evidence: z.string().max(8000).optional().default("")
});

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    const { data, error } = await req.app.locals.supabase
      .from("workspace_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return next(error);
    res.json({ items: data || [] });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { data, error } = await req.app.locals.supabase
      .from("workspace_items")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) return next(error);
    res.json({ item: data });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid workspace item.",
        details: parsed.error.flatten()
      });
    }

    const { data, error } = await req.app.locals.supabase
      .from("workspace_items")
      .insert({
        ...parsed.data,
        status: "Saved to Supabase",
        source: "User entered"
      })
      .select()
      .single();

    if (error) return next(error);
    res.status(201).json({ item: data, message: "Workspace item saved." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

function requireSupabase(req, res, next) {
  if (!req.app.locals.supabaseConfigured || !req.app.locals.supabase) {
    return res.status(503).json({
      error: "Supabase is not configured.",
      code: "SUPABASE_NOT_CONFIGURED",
      action: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env, then restart the API."
    });
  }
  next();
}
module.exports = { requireSupabase };

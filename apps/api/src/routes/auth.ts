import { Router } from "express";
import { isSupabaseConfigured, supabaseAdmin } from "../lib/supabaseAdmin";

export const authRouter = Router();

authRouter.get("/session", async (req, res) => {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    res.status(503).json({ error: "supabase_not_configured" });
    return;
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "missing_token" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "invalid_token" });
    return;
  }

  res.json({ user: { id: data.user.id, email: data.user.email } });
});

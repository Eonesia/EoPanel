import { Router } from "express";

export const notificationsRouter = Router();

// Mock por ahora — el frontend usa datos locales en esta fase (ver apps/web/src/data).
// Este endpoint expone el mismo contrato (counts por id de tag) para cuando se conecten
// fuentes reales y el frontend empiece a consumirlo en vez de su mock local.
const mockTagCounts: Record<string, number> = {
  caja: 1,
  prioridades: 3,
  "seguimiento-proyectos": 2,
  mundos360: 2,
  "producto-clientes": 1,
  encargos: 4,
  prevision: 1,
  facturacion: 2,
  suscripciones: 1,
  "mail-info": 4,
  "mail-desarrollo": 2,
  "mail-alvaro": 3,
};

notificationsRouter.get("/summary", (_req, res) => {
  res.json({ counts: mockTagCounts, updatedAt: new Date().toISOString() });
});

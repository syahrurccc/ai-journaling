import { Router } from "express";

import { requireAuth } from "../middleware/requireAuth";
import { journalQuerySchema } from "../validations/zodSchemas";
import { isMoreThanAWeekApart, throwErr, toUtcDateOnly } from "../utils/utils";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  if (!req.query) throwErr("Date interval required", 405);
  
  const { from, to } = journalQuerySchema.parse(req.query);
  const today = toUtcDateOnly(new Date());
  
  if (!from) throwErr("Starting date needs to be defined", 400);
  
  if (from && new Date(from) > today) {
    throwErr("Can't be from the future", 400);
  }
  
  if (from && to) {
    const d1 = new Date(from);
    const d2 = new Date(to);
    
    if (d1 > d2) {
      throwErr("Invalid date intervals", 400);
    } else if (isMoreThanAWeekApart(d1, d2)) {
      throwErr("Date intervals are more than a week", 400);
    }
  }
  
    
  
});

router.get("/:id", requireAuth, async (req, res) => {

});

router.get("/weekly", requireAuth, async (req, res) => {

});

export default router;
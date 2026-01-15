import { Router } from "express";
import { idSchema, journalQuerySchema, journalSchema } from "../validations/zodSchemas";
import { requireAuth } from "../middleware/requireAuth";
import { journalRepository } from "../repository/journal.repo";

const router = Router();
const journalRepo = journalRepository();

router.post("/", requireAuth, async (req, res) => {
  const { content } = journalSchema.parse(req.body);

  const journal = await journalRepo.create(req.userId!, content);
  
  res.status(201).json({
    message: "Entry created",
    journal,
  });
});

router.get("/", requireAuth, async (req, res) => {
  const { from, to } = journalQuerySchema.parse(req.query);
  const userId = req.userId!
  
  const journals = journalRepo.getMany(userId, from, to);
  
  res.status(200).json(journals);
});

router.get("/:id", requireAuth, async (req, res) => {
  const journalId = idSchema.parse(req.params.id);
  
  const journal = journalRepo.getOne(journalId);
  
  res.status(200).json(journal);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const journalId = idSchema.parse(req.params.id);
  journalRepo.deleteOne(journalId);
  
  res.status(201).json({ message: "Entry deleted" })
});

export default router;

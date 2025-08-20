import express from "express";
// import { Villa } from "../models/Villa.model.js";

const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    console.log("🔍 Request body:", req.body);

    const { location, guests } = req.body;

    if (!location || !guests) {
      return res.status(400).json({ error: "Missing location or guests" });
    }

    const filteredVillas = sampleVillas.filter(
      (villa) =>
        villa.location.toLowerCase().includes(location.toLowerCase()) &&
        villa.guests >= guests
    );

    console.log(`✅ Villas found: ${filteredVillas.length}`);
    res.json(filteredVillas);
  } catch (err) {
    console.error("❌ Error in villa search:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ⭐ Public villas route (NEW!)
router.get("/public/villas", (req, res) => {
  res.json(sampleVillas);
});

export default router;

import { Router } from "express";
import { generateHeatmapData } from "../utils/processHeatmap";
import * as pointsLogic from "../logic/points";

const router = Router();

/**
 * GET /heatmap?type=walk|bike|destinations|all
 */
router.get("/", async (req, res) => {
  try {
    const type = (req.query.type as string) || "all";

    let rawPoints;

    switch (type) {
      case "walk":
        rawPoints = await pointsLogic.getWalkingPoints();
        break;

      case "bike":
        rawPoints = await pointsLogic.getCyclingPoints();
        break;

      case "destinations":
        rawPoints = await pointsLogic.getDestinationPoints();
        break;

      default:
        rawPoints = await pointsLogic.getAllPoints();
    }

    if (!rawPoints || rawPoints.length === 0) {
      return res.json([]);
    }

    const heatmap = generateHeatmapData(rawPoints);

    res.json(heatmap);
  } catch (err) {
    console.error("Heatmap error:", err);
    res.status(500).json({ error: "Failed to generate heatmap data" });
  }
});

export default router;

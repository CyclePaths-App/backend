export function generateHeatmapData(rawPoints: any[]) {
  const counts: Record<string, number> = {};

  for (const p of rawPoints) {
    const key = `${p.latitude.toFixed(6)},${p.longitude.toFixed(6)}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  const maxCount = Math.max(...Object.values(counts));

  return Object.entries(counts).map(([key, count]) => {
    const parts = key.split(",");
    const lat = parts[0]!;
    const lng = parts[1]!;

    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      intensity: parseFloat((count / maxCount).toFixed(3)),
    };
  });
}

export function calculateVehicleScore({ km, avgSpeed, activeDays }) {
  const score =
    (km * 0.6) +
    (avgSpeed * 0.3) +
    (activeDays * 0.1);

  return Number(score.toFixed(1));
}
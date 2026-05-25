// src/utils/calcScore.v1.js

/**
 * 📊 SCORE V1 (OFICIAL)
 * Métrica de performance da frota
 */

export function calculateScoreV1(vehicle) {
  const km = Number(vehicle.km || 0);
  const speed = Number(vehicle.avgSpeed || 0);
  const days = Number(vehicle.activeDays || 0);

  const score =
    (km * 0.5) +
    (speed * 10) +
    (days * 8);

  return Number(score.toFixed(2));
}
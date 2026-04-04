/**
 * liteRiskService.js — Minimalistic Risk Scoring for Free Tier Deploys
 * 
 * Replaces the heavy Python ML service with a weighted heuristic model
 * to save RAM and CPU on free hosting tiers (Hugging Face / Render Free).
 */

const computeLiteRiskScore = (data) => {
  const { weather, traffic, pollution, history, isNewUser } = data;

  // Normalized weights for a demo-level realistic score
  const weights = {
    weather: 0.35,   // Bad weather is a high risk factor
    traffic: 0.25,   // Heavy traffic increases accident probability
    pollution: 0.10, // Minor secondary factor
    history: 0.20,   // Past behavior (0.0 good, 1.0 bad)
    newUser: 0.10    // Slight penalty for lack of data
  };

  // Convert 0-10 inputs to 0-1 range
  const w = (weather || 0) / 10;
  const t = (traffic || 0) / 10;
  const p = (pollution || 0) / 10;
  const h = (history || 0);

  let score = (w * weights.weather) + 
              (t * weights.traffic) + 
              (p * weights.pollution) + 
              (h * weights.history);

  if (isNewUser) {
    score += weights.newUser;
  }

  // Ensure 0-1 range and round to 4 decimals
  return Math.max(0, Math.min(1, Math.round(score * 10000) / 10000));
};

module.exports = { computeLiteRiskScore };

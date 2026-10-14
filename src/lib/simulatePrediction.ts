/**
 * simulatePrediction.ts
 *
 * DEMO PREDICTION ENGINE — NOT THE TRAINED TabPFN MODEL
 * ──────────────────────────────────────────────────────
 * This module provides a purely deterministic, client-side scoring function
 * for the ChurnIQ interactive prototype. It has NO connection to the TabPFN
 * model trained in the Jupyter notebook.
 *
 * The logic is intentionally simple and illustrative:
 *  1. First checks whether the input exactly matches one of the three
 *     predefined demo profiles → returns the hand-authored result.
 *  2. Otherwise, applies a weighted additive scoring function based on
 *     characteristics that are empirically associated with churn in the
 *     Telco dataset (contract type, tenure, payment method, etc.).
 *
 * Thresholds:
 *   < 40  → Low Risk  (Predicted: Stay)
 *   40–69 → Medium Risk (Predicted: Churn)
 *   ≥ 70  → High Risk   (Predicted: Churn)
 *
 * The same input always produces the same output (no randomness).
 */

import type {
  CustomerInput,
  PredictionResult,
  RiskFactor,
  RiskLevel,
  PredictedClass,
} from '../types/customer';

import {
  HIGH_RISK_INPUT,
  HIGH_RISK_RESULT,
  MEDIUM_RISK_INPUT,
  MEDIUM_RISK_RESULT,
  LOW_RISK_INPUT,
  LOW_RISK_RESULT,
} from '../data/demoCustomers';

// ─────────────────────────────────────────────────────────────────────────────
// Exact-match helper
// ─────────────────────────────────────────────────────────────────────────────

function inputsMatch(a: CustomerInput, b: CustomerInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoring weights (illustrative — not derived from SHAP or model coefficients)
// ─────────────────────────────────────────────────────────────────────────────

function computeIllustrativeScore(c: CustomerInput): number {
  let score = 20; // baseline

  // Contract type — strongest signal in the dataset
  if (c.contract === 'Month-to-month') score += 30;
  else if (c.contract === 'One year') score += 10;
  else score -= 15; // Two year

  // Tenure (log-scaled to penalise brand-new customers heavily)
  if (c.tenure <= 3) score += 20;
  else if (c.tenure <= 12) score += 10;
  else if (c.tenure <= 24) score += 2;
  else if (c.tenure <= 48) score -= 5;
  else score -= 12;

  // Internet service type
  if (c.internetService === 'Fiber optic') score += 12;
  else if (c.internetService === 'DSL') score += 2;
  else score -= 8; // No internet

  // Add-on protective services (each reduces risk)
  if (c.onlineSecurity === 'No') score += 5;
  if (c.techSupport === 'No') score += 5;
  if (c.onlineBackup === 'No') score += 3;
  if (c.deviceProtection === 'No') score += 3;

  // Payment method
  if (c.paymentMethod === 'Electronic check') score += 10;
  else if (c.paymentMethod === 'Mailed check') score += 4;
  else score -= 5; // automatic payment methods

  // Paperless billing (mild positive correlation with churn)
  if (c.paperlessBilling === 'Yes') score += 4;

  // Household ties
  if (c.partner === 'Yes') score -= 5;
  if (c.dependents === 'Yes') score -= 7;

  // Monthly charges (high charges → higher risk)
  if (c.monthlyCharges > 80) score += 8;
  else if (c.monthlyCharges > 60) score += 3;

  // Clamp to [5, 95]
  return Math.min(95, Math.max(5, Math.round(score)));
}

// ─────────────────────────────────────────────────────────────────────────────
// Risk factor builder for non-predefined inputs
// ─────────────────────────────────────────────────────────────────────────────

function buildRiskFactors(c: CustomerInput, score: number): RiskFactor[] {
  const factors: RiskFactor[] = [];

  if (c.contract === 'Month-to-month') {
    factors.push({
      label: 'Month-to-month contract',
      description: 'No long-term commitment — easiest contract type to exit.',
      impact: 'positive',
    });
  } else if (c.contract === 'Two year') {
    factors.push({
      label: 'Two-year contract',
      description: 'Strong commitment reduces exit likelihood significantly.',
      impact: 'negative',
    });
  }

  if (c.tenure <= 6) {
    factors.push({
      label: `Very short tenure (${c.tenure} months)`,
      description: 'New customers have minimal switching costs.',
      impact: 'positive',
    });
  } else if (c.tenure >= 48) {
    factors.push({
      label: `Long tenure (${c.tenure} months)`,
      description: 'Established customers are significantly more loyal.',
      impact: 'negative',
    });
  }

  if (c.internetService === 'Fiber optic') {
    factors.push({
      label: 'Fiber optic internet',
      description: 'Premium service tier — associated with higher churn rates in this dataset.',
      impact: 'positive',
    });
  }

  if (c.onlineSecurity === 'No' && c.techSupport === 'No') {
    factors.push({
      label: 'No security or tech support add-ons',
      description: 'Customers without protective add-ons churn more frequently.',
      impact: 'positive',
    });
  } else if (c.onlineSecurity === 'Yes' && c.techSupport === 'Yes') {
    factors.push({
      label: 'Online Security & Tech Support active',
      description: 'Add-on services create stickiness and reduce churn.',
      impact: 'negative',
    });
  }

  if (c.paymentMethod === 'Electronic check') {
    factors.push({
      label: 'Electronic check payment',
      description: 'Manual payment methods correlate with higher churn in this dataset.',
      impact: 'positive',
    });
  } else if (
    c.paymentMethod === 'Credit card (automatic)' ||
    c.paymentMethod === 'Bank transfer (automatic)'
  ) {
    factors.push({
      label: 'Automatic payment method',
      description: 'Set-and-forget billing reduces cancellation intent.',
      impact: 'negative',
    });
  }

  if (c.partner === 'Yes' || c.dependents === 'Yes') {
    factors.push({
      label: 'Family account',
      description: 'Partner or dependents create household lock-in.',
      impact: 'negative',
    });
  }

  // Keep to max 5 factors
  return factors.slice(0, 5);
}

// ─────────────────────────────────────────────────────────────────────────────
// Recommendation builder
// ─────────────────────────────────────────────────────────────────────────────

function buildRecommendation(riskLevel: RiskLevel, c: CustomerInput): string {
  if (riskLevel === 'High') {
    return c.contract === 'Month-to-month'
      ? 'Consider offering a discounted one-year contract upgrade, a free security add-on trial, and a proactive outreach call from customer success.'
      : `Review the customer's service experience and consider a satisfaction check-in. A personalised offer may help retain them.`;
  }
  if (riskLevel === 'Medium') {
    return 'A targeted loyalty offer — Tech Support trial or a billing discount — could tip this customer toward staying. Monitor engagement closely.';
  }
  return 'This customer appears stable. Maintain relationship quality and consider a simple appreciation reward to reinforce loyalty.';
}

// ─────────────────────────────────────────────────────────────────────────────
// Main exported function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * simulatePrediction
 *
 * Returns a deterministic PredictionResult for a given CustomerInput.
 * Does NOT call any external API or load any ML model.
 */
export function simulatePrediction(input: CustomerInput): PredictionResult {
  // 1. Check for exact predefined profile matches
  if (inputsMatch(input, HIGH_RISK_INPUT)) return HIGH_RISK_RESULT;
  if (inputsMatch(input, MEDIUM_RISK_INPUT)) return MEDIUM_RISK_RESULT;
  if (inputsMatch(input, LOW_RISK_INPUT)) return LOW_RISK_RESULT;

  // 2. Apply illustrative scoring for non-predefined inputs
  const score = computeIllustrativeScore(input);

  const riskLevel: RiskLevel =
    score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  const predictedClass: PredictedClass = riskLevel === 'Low' ? 'Stay' : 'Churn';

  const riskFactors = buildRiskFactors(input, score);
  const recommendation = buildRecommendation(riskLevel, input);

  return {
    churnProbability: score,
    predictedClass,
    riskLevel,
    riskFactors,
    recommendation,
    isPredefined: false,
  };
}

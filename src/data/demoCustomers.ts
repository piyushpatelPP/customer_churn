import type {
  CustomerInput,
  DemoCustomer,
  PredictionResult,
} from '../types/customer';

// ─────────────────────────────────────────────────────────────────────────────
// PREDEFINED DEMO CUSTOMERS
// These three profiles have fixed, hand-authored prediction results for the
// demo. They are NOT outputs from the trained TabPFN model; they are
// illustrative examples for the frontend prototype.
// ─────────────────────────────────────────────────────────────────────────────

export const HIGH_RISK_INPUT: CustomerInput = {
  gender: 'Female',
  seniorCitizen: 'No',
  partner: 'No',
  dependents: 'No',
  tenure: 2,
  phoneService: 'Yes',
  multipleLines: 'No',
  internetService: 'Fiber optic',
  onlineSecurity: 'No',
  onlineBackup: 'No',
  deviceProtection: 'No',
  techSupport: 'No',
  streamingTV: 'Yes',
  streamingMovies: 'Yes',
  contract: 'Month-to-month',
  paperlessBilling: 'Yes',
  paymentMethod: 'Electronic check',
  monthlyCharges: 89.5,
  totalCharges: 179.0,
};

export const HIGH_RISK_RESULT: PredictionResult = {
  churnProbability: 82,
  predictedClass: 'Churn',
  riskLevel: 'High',
  isPredefined: true,
  riskFactors: [
    {
      label: 'Month-to-month contract',
      description: 'No long-term commitment — easiest to leave at any time.',
      impact: 'positive',
    },
    {
      label: 'Very short tenure (2 months)',
      description: 'Customer has barely settled in; switching costs are minimal.',
      impact: 'positive',
    },
    {
      label: 'Fiber optic with no add-on protections',
      description: 'Premium internet with zero security or support services attached.',
      impact: 'positive',
    },
    {
      label: 'Electronic check payment',
      description: 'Historically the payment method most correlated with churn in this dataset.',
      impact: 'positive',
    },
    {
      label: 'No partner or dependents',
      description: 'Single customers face fewer household lock-in effects.',
      impact: 'positive',
    },
  ],
  recommendation:
    'Consider offering a discounted one-year contract upgrade, free Online Security add-on for 3 months, and a proactive check-in call from customer success.',
};

export const MEDIUM_RISK_INPUT: CustomerInput = {
  gender: 'Male',
  seniorCitizen: 'Yes',
  partner: 'Yes',
  dependents: 'No',
  tenure: 18,
  phoneService: 'Yes',
  multipleLines: 'Yes',
  internetService: 'Fiber optic',
  onlineSecurity: 'No',
  onlineBackup: 'Yes',
  deviceProtection: 'No',
  techSupport: 'No',
  streamingTV: 'Yes',
  streamingMovies: 'Yes',
  contract: 'Month-to-month',
  paperlessBilling: 'Yes',
  paymentMethod: 'Electronic check',
  monthlyCharges: 94.2,
  totalCharges: 1695.6,
};

export const MEDIUM_RISK_RESULT: PredictionResult = {
  churnProbability: 54,
  predictedClass: 'Churn',
  riskLevel: 'Medium',
  isPredefined: true,
  riskFactors: [
    {
      label: 'Month-to-month contract',
      description: 'Still on a flexible plan with low exit friction.',
      impact: 'positive',
    },
    {
      label: 'Moderate tenure (18 months)',
      description: 'Some loyalty established, but not yet deeply embedded.',
      impact: 'negative',
    },
    {
      label: 'Has partner',
      description: 'Shared account usage tends to increase retention.',
      impact: 'negative',
    },
    {
      label: 'No Tech Support',
      description: 'Unresolved issues may cause frustration over time.',
      impact: 'positive',
    },
    {
      label: 'Online Backup present',
      description: 'At least one add-on service reduces switching ease.',
      impact: 'negative',
    },
  ],
  recommendation:
    'A targeted offer — Tech Support free trial or a loyalty discount — could tip this customer toward staying. Consider a one-year contract incentive.',
};

export const LOW_RISK_INPUT: CustomerInput = {
  gender: 'Female',
  seniorCitizen: 'No',
  partner: 'Yes',
  dependents: 'Yes',
  tenure: 72,
  phoneService: 'Yes',
  multipleLines: 'Yes',
  internetService: 'DSL',
  onlineSecurity: 'Yes',
  onlineBackup: 'Yes',
  deviceProtection: 'Yes',
  techSupport: 'Yes',
  streamingTV: 'Yes',
  streamingMovies: 'Yes',
  contract: 'Two year',
  paperlessBilling: 'No',
  paymentMethod: 'Credit card (automatic)',
  monthlyCharges: 89.95,
  totalCharges: 6476.4,
};

export const LOW_RISK_RESULT: PredictionResult = {
  churnProbability: 9,
  predictedClass: 'Stay',
  riskLevel: 'Low',
  isPredefined: true,
  riskFactors: [
    {
      label: 'Two-year contract',
      description: 'Strongest contractual commitment — very high switching cost.',
      impact: 'negative',
    },
    {
      label: 'Long tenure (72 months)',
      description: 'Six years of loyalty indicates deep brand attachment.',
      impact: 'negative',
    },
    {
      label: 'Full add-on coverage',
      description: 'Security, Backup, Device Protection, and Tech Support all active.',
      impact: 'negative',
    },
    {
      label: 'Has dependents & partner',
      description: 'Household account — multiple stakeholders means more inertia.',
      impact: 'negative',
    },
    {
      label: 'Automatic credit card payment',
      description: 'Set-and-forget billing minimises friction and cancellation intent.',
      impact: 'negative',
    },
  ],
  recommendation:
    'This customer is highly stable. Focus retention efforts elsewhere. A simple appreciation reward could strengthen loyalty further.',
};

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: 'high-risk',
    label: 'High Risk',
    riskLevel: 'High',
    description: 'New fiber customer, month-to-month, no add-ons',
    input: HIGH_RISK_INPUT,
    result: HIGH_RISK_RESULT,
  },
  {
    id: 'medium-risk',
    label: 'Medium Risk',
    riskLevel: 'Medium',
    description: 'Senior on fiber, 18 months, some add-ons',
    input: MEDIUM_RISK_INPUT,
    result: MEDIUM_RISK_RESULT,
  },
  {
    id: 'low-risk',
    label: 'Low Risk',
    riskLevel: 'Low',
    description: 'Long-term family customer, two-year contract',
    input: LOW_RISK_INPUT,
    result: LOW_RISK_RESULT,
  },
];

export const DEFAULT_CUSTOMER_INPUT: CustomerInput = {
  gender: 'Male',
  seniorCitizen: 'No',
  partner: 'No',
  dependents: 'No',
  tenure: 12,
  phoneService: 'Yes',
  multipleLines: 'No',
  internetService: 'DSL',
  onlineSecurity: 'No',
  onlineBackup: 'No',
  deviceProtection: 'No',
  techSupport: 'No',
  streamingTV: 'No',
  streamingMovies: 'No',
  contract: 'Month-to-month',
  paperlessBilling: 'No',
  paymentMethod: 'Mailed check',
  monthlyCharges: 45.0,
  totalCharges: 540.0,
};

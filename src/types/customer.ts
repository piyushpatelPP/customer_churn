// Customer feature types matching the 19 input features used in the notebook
// (excludes customerID and Churn label)

export type Gender = 'Female' | 'Male';
export type YesNo = 'Yes' | 'No';
export type YesNoNoService = 'Yes' | 'No' | 'No internet service';
export type MultipleLinesOption = 'Yes' | 'No' | 'No phone service';
export type InternetServiceOption = 'DSL' | 'Fiber optic' | 'No';
export type ContractOption = 'Month-to-month' | 'One year' | 'Two year';
export type PaymentMethodOption =
  | 'Electronic check'
  | 'Mailed check'
  | 'Bank transfer (automatic)'
  | 'Credit card (automatic)';

export interface CustomerInput {
  // Section A: Customer Profile
  gender: Gender;
  seniorCitizen: YesNo;
  partner: YesNo;
  dependents: YesNo;
  tenure: number; // 0-72 months

  // Section B: Services
  phoneService: YesNo;
  multipleLines: MultipleLinesOption;
  internetService: InternetServiceOption;
  onlineSecurity: YesNoNoService;
  onlineBackup: YesNoNoService;
  deviceProtection: YesNoNoService;
  techSupport: YesNoNoService;
  streamingTV: YesNoNoService;
  streamingMovies: YesNoNoService;

  // Section C: Billing and Contract
  contract: ContractOption;
  paperlessBilling: YesNo;
  paymentMethod: PaymentMethodOption;
  monthlyCharges: number;
  totalCharges: number;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type PredictedClass = 'Churn' | 'Stay';

export interface RiskFactor {
  label: string;
  description: string;
  impact: 'positive' | 'negative'; // positive = increases churn risk, negative = decreases
}

export interface PredictionResult {
  churnProbability: number; // 0-100
  predictedClass: PredictedClass;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  recommendation: string;
  isPredefined: boolean; // true = matched a demo profile exactly
}

export interface DemoCustomer {
  id: string;
  label: string;
  riskLevel: RiskLevel;
  description: string;
  input: CustomerInput;
  result: PredictionResult;
}

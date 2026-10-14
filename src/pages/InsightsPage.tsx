import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Database, TrendingDown } from 'lucide-react';

const churnDonut = [
  { name: 'Retained (73.5%)', value: 5174 },
  { name: 'Churned (26.5%)', value: 1869 },
];
const DONUT_COLORS = ['#2563eb', '#f97316'];

// Contract churn rates — verified illustrative from the notebook report
const contractData = [
  { contract: 'Month-to-Month', churnRate: 42.7, count: 3875, color: '#ef4444' },
  { contract: 'One Year', churnRate: 11.3, count: 1473, color: '#f97316' },
  { contract: 'Two Year', churnRate: 2.8, count: 1695, color: '#10b981' },
];

// Tenure density buckets (illustrative — based on general dataset trends)
const tenureData = [
  { bucket: '0–12 mo', stayed: 1200, churned: 720 },
  { bucket: '13–24 mo', stayed: 850, churned: 380 },
  { bucket: '25–36 mo', stayed: 720, churned: 280 },
  { bucket: '37–48 mo', stayed: 680, churned: 200 },
  { bucket: '49–60 mo', stayed: 760, churned: 180 },
  { bucket: '61–72 mo', stayed: 964, churned: 109 },
];

// Monthly charges distribution (illustrative)
const chargesData = [
  { range: '$0–25', stayed: 480, churned: 45 },
  { range: '$25–50', stayed: 1100, churned: 180 },
  { range: '$50–75', stayed: 1400, churned: 420 },
  { range: '$75–100', stayed: 1200, churned: 680 },
  { range: '$100+', stayed: 994, churned: 544 },
];

const features = [
  { name: 'Contract', description: 'Contract type (Month-to-month, One year, Two year)', category: 'Billing' },
  { name: 'Tenure', description: 'Number of months with the service', category: 'Profile' },
  { name: 'InternetService', description: 'DSL, Fiber optic, or No internet', category: 'Service' },
  { name: 'PaymentMethod', description: 'How the customer pays their bill', category: 'Billing' },
  { name: 'OnlineSecurity', description: 'Whether the customer has online security add-on', category: 'Service' },
  { name: 'TechSupport', description: 'Whether the customer has tech support add-on', category: 'Service' },
  { name: 'PaperlessBilling', description: 'Whether customer uses paperless billing', category: 'Billing' },
  { name: 'MonthlyCharges', description: 'Monthly bill amount in dollars', category: 'Billing' },
  { name: 'TotalCharges', description: 'Total amount charged to date', category: 'Billing' },
  { name: 'OnlineBackup', description: 'Online backup add-on status', category: 'Service' },
  { name: 'DeviceProtection', description: 'Device protection plan status', category: 'Service' },
  { name: 'StreamingTV', description: 'TV streaming service subscription', category: 'Service' },
  { name: 'StreamingMovies', description: 'Movie streaming subscription', category: 'Service' },
  { name: 'MultipleLines', description: 'Multiple phone lines', category: 'Service' },
  { name: 'PhoneService', description: 'Phone service subscription', category: 'Service' },
  { name: 'Gender', description: 'Customer gender', category: 'Profile' },
  { name: 'SeniorCitizen', description: 'Whether customer is senior citizen', category: 'Profile' },
  { name: 'Partner', description: 'Whether customer has a partner', category: 'Profile' },
  { name: 'Dependents', description: 'Whether customer has dependents', category: 'Profile' },
];

const categoryColors: Record<string, string> = {
  Billing: 'bg-blue-100 text-blue-700',
  Service: 'bg-purple-100 text-purple-700',
  Profile: 'bg-emerald-100 text-emerald-700',
};

const InsightsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-navy mb-1">Dataset Insights</h2>
        <p className="text-slate-500 text-sm">
          Exploratory data analysis of the Telco Customer Churn dataset (7,043 customers).
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
          <Database size={12} className="text-blue-500" />
          <span className="text-xs text-blue-600 font-semibold">
            Verified counts: 5,174 stayed · 1,869 churned. Breakdowns are illustrative visualizations.
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Class balance donut */}
        <div className="card p-5">
          <h3 className="font-bold text-navy mb-1">Class Balance</h3>
          <p className="text-xs text-slate-400 mb-4">Verified dataset counts</p>
          <div className="flex items-center gap-6">
            <div style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={churnDonut} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {churnDonut.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [Number(value ?? 0).toLocaleString(), ''] as [string, string]} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold text-navy">Retained</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">5,174</div>
                <div className="text-xs text-slate-400">73.46%</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm font-semibold text-navy">Churned</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">1,869</div>
                <div className="text-xs text-slate-400">26.54%</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            Dataset is imbalanced — roughly 1 in 4 customers churns.
          </p>
        </div>

        {/* Contract churn rate */}
        <div className="card p-5">
          <h3 className="font-bold text-navy mb-1">Churn Rate by Contract Type</h3>
          <p className="text-xs text-slate-400 mb-4">Illustrative visualization based on dataset patterns</p>
          <div className="space-y-3">
            {contractData.map(d => (
              <div key={d.contract}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-navy">{d.contract}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">n={d.count.toLocaleString()}</span>
                    <span className="text-sm font-bold" style={{ color: d.color }}>{d.churnRate}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.churnRate}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            Month-to-month contracts show markedly higher churn rates.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tenure */}
        <div className="card p-5">
          <h3 className="font-bold text-navy mb-1">Tenure Distribution by Outcome</h3>
          <p className="text-xs text-amber-600 mb-4">⚠ Illustrative visualization — not exact empirical counts</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tenureData} barSize={18} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="stayed" name="Stayed" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="churned" name="Churned" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2 italic">
            New customers (0–12 months) show the highest churn density.
          </p>
        </div>

        {/* Monthly charges */}
        <div className="card p-5">
          <h3 className="font-bold text-navy mb-1">Monthly Charges vs Churn</h3>
          <p className="text-xs text-amber-600 mb-4">⚠ Illustrative visualization — not exact empirical counts</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chargesData} barSize={18} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="stayed" name="Stayed" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="churned" name="Churned" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2 italic">
            Higher monthly charges correlate with increased churn probability.
          </p>
        </div>
      </div>

      {/* Features list */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown size={18} className="text-blue-500" />
          <h3 className="font-bold text-navy">Features Explored in This Project</h3>
          <span className="ml-auto text-xs text-slate-400">19 predictive features (excludes customerID, Churn)</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {features.map(f => (
            <div key={f.name} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${categoryColors[f.category]}`}>
                {f.category}
              </span>
              <div>
                <div className="text-xs font-bold text-navy">{f.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{f.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;

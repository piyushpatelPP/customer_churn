import React, { useState, useEffect } from 'react';
import {
  User, Wifi, CreditCard, RotateCcw, Zap, AlertCircle,
  CheckCircle, AlertTriangle, Minus, ChevronDown, FlaskConical,
  TrendingDown, TrendingUp, ArrowRight, Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CustomerInput, PredictionResult } from '../types/customer';
import { DEMO_CUSTOMERS, DEFAULT_CUSTOMER_INPUT } from '../data/demoCustomers';
import { simulatePrediction } from '../lib/simulatePrediction';

interface PredictPageProps {
  initialInput?: CustomerInput | null;
  onClearInitial?: () => void;
}

const RISK_CONFIG = {
  High: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', gauge: '#ef4444', icon: AlertTriangle },
  Medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', gauge: '#f97316', icon: Minus },
  Low: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', gauge: '#10b981', icon: CheckCircle },
};

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}
const Field: React.FC<FieldProps> = ({ label, children, error }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const selectClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-navy field-focus hover:border-blue-300 transition-colors";
const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-navy field-focus hover:border-blue-300 transition-colors";

type ValidationErrors = Partial<Record<keyof CustomerInput, string>>;

function validate(c: CustomerInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (c.tenure < 0 || c.tenure > 72) errors.tenure = 'Tenure must be 0–72 months';
  if (c.monthlyCharges < 0) errors.monthlyCharges = 'Monthly charges cannot be negative';
  if (c.totalCharges < 0) errors.totalCharges = 'Total charges cannot be negative';
  return errors;
}

const GaugeChart: React.FC<{ probability: number; color: string }> = ({ probability, color }) => {
  const r = 70;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - probability / 100);
  return (
    <svg width="180" height="100" viewBox="0 0 180 100">
      <path d={`M 10 90 A ${r} ${r} 0 0 1 170 90`} fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
      <path
        d={`M 10 90 A ${r} ${r} 0 0 1 170 90`}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
      <text x="90" y="82" textAnchor="middle" fontSize="26" fontWeight="700" fill={color}>
        {probability}%
      </text>
    </svg>
  );
};

const ResultPanel: React.FC<{ result: PredictionResult; input: CustomerInput; onReset: () => void }> = ({ result, input, onReset }) => {
  const cfg = RISK_CONFIG[result.riskLevel];
  const Icon = cfg.icon;
  const donutData = [
    { name: 'Churn', value: result.churnProbability },
    { name: 'Stay', value: 100 - result.churnProbability },
  ];
  const COLORS = [cfg.gauge, '#2563eb'];

  return (
    <div className="animate-result space-y-5">
      {/* Outcome badge */}
      <div className={`rounded-2xl p-5 border ${cfg.border} ${cfg.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={20} className={cfg.color} />
            <span className={`font-bold text-lg ${cfg.color}`}>
              {result.predictedClass === 'Churn' ? 'Likely to Churn' : 'Likely to Stay'}
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
            {result.riskLevel} Risk
          </span>
        </div>

        <div className="flex items-center gap-6">
          <GaugeChart probability={result.churnProbability} color={cfg.gauge} />
          <div className="flex-1">
            <div className="w-32 h-32 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={38} outerRadius={56} dataKey="value" paddingAngle={3}>
                    {donutData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 -mt-1">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: cfg.gauge }} /><span className="text-xs text-slate-500">Churn</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-xs text-slate-500">Stay</span></div>
            </div>
          </div>
        </div>

        {/* Risk meter */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Low Risk</span><span>High Risk</span>
          </div>
          <div className="h-2 risk-track rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow"
              style={{ left: `${result.churnProbability}%`, borderColor: cfg.gauge, transition: 'left 1s ease-out' }}
            />
          </div>
        </div>
      </div>

      {/* Demo reasoning */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical size={14} className="text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 tracking-wide">ILLUSTRATIVE FACTORS (Demo reasoning — not SHAP)</span>
        </div>
        <ul className="space-y-2">
          {result.riskFactors.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className={`mt-0.5 flex-shrink-0 ${f.impact === 'positive' ? 'text-red-400' : 'text-emerald-500'}`}>
                {f.impact === 'positive' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              </span>
              <div>
                <span className="text-sm font-semibold text-navy">{f.label}</span>
                <p className="text-xs text-slate-500 mt-0.5">{f.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="card p-4 border-l-4 border-l-blue-500">
        <div className="flex items-start gap-2">
          <Zap size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Suggested Retention Action</div>
            <p className="text-sm text-slate-700">{result.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Input summary */}
      <div className="card p-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Customer Summary</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {([
            ['Contract', input.contract],
            ['Tenure', `${input.tenure} mo`],
            ['Internet', input.internetService],
            ['Monthly', `$${input.monthlyCharges}`],
            ['Payment', input.paymentMethod],
            ['Security', input.onlineSecurity],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-xs text-slate-400">{k}</span>
              <span className="text-xs font-semibold text-navy truncate ml-2">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-2.5 text-sm font-semibold text-electric border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} /> Try Another Customer
      </button>

      {result.isPredefined && (
        <p className="text-center text-xs text-slate-400">
          ✓ This matched a predefined demo profile with a fixed illustrative result.
        </p>
      )}
    </div>
  );
};

const PredictPage: React.FC<PredictPageProps> = ({ initialInput, onClearInitial }) => {
  const [form, setForm] = useState<CustomerInput>(initialInput ?? DEFAULT_CUSTOMER_INPUT);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialInput) {
      setForm(initialInput);
      setResult(null);
      onClearInitial?.();
    }
  }, [initialInput]);

  const set = <K extends keyof CustomerInput>(key: K, value: CustomerInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulatePrediction(form));
      setLoading(false);
    }, 700);
  };

  const handleReset = () => {
    setForm(DEFAULT_CUSTOMER_INPUT);
    setErrors({});
    setResult(null);
  };

  const loadDemo = (id: string) => {
    const demo = DEMO_CUSTOMERS.find(d => d.id === id);
    if (demo) { setForm(demo.input); setResult(null); setErrors({}); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy mb-1">Customer Churn Prediction</h2>
        <p className="text-slate-500 text-sm">Fill in customer details and click Analyze to get a simulated churn risk assessment.</p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <FlaskConical size={12} className="text-amber-500" />
          <span className="text-xs text-amber-600 font-semibold">DEMO MODE · Simulated predictions · Live model inference is not connected</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Load example bar */}
          <div className="card p-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Load Example:</span>
            {DEMO_CUSTOMERS.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => loadDemo(d.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  d.riskLevel === 'High' ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' :
                  d.riskLevel === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' :
                  'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {d.label} Risk
              </button>
            ))}
            <button type="button" onClick={handleReset} className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Section A */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <User size={14} className="text-blue-600" />
              </div>
              <span className="font-bold text-navy text-sm">A · Customer Profile</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Gender">
                <select className={selectClass} value={form.gender} onChange={e => set('gender', e.target.value as any)}>
                  <option>Female</option><option>Male</option>
                </select>
              </Field>
              <Field label="Senior Citizen">
                <select className={selectClass} value={form.seniorCitizen} onChange={e => set('seniorCitizen', e.target.value as any)}>
                  <option>No</option><option>Yes</option>
                </select>
              </Field>
              <Field label="Partner">
                <select className={selectClass} value={form.partner} onChange={e => set('partner', e.target.value as any)}>
                  <option>No</option><option>Yes</option>
                </select>
              </Field>
              <Field label="Dependents">
                <select className={selectClass} value={form.dependents} onChange={e => set('dependents', e.target.value as any)}>
                  <option>No</option><option>Yes</option>
                </select>
              </Field>
              <Field label={`Tenure: ${form.tenure} months`} error={errors.tenure}>
                <input
                  type="range" min={0} max={72} value={form.tenure}
                  onChange={e => set('tenure', parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0 mo</span><span>72 mo</span></div>
              </Field>
              <Field label="Tenure (exact months)" error={errors.tenure}>
                <input
                  type="number" min={0} max={72} value={form.tenure}
                  onChange={e => set('tenure', Math.min(72, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Section B */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                <Wifi size={14} className="text-purple-600" />
              </div>
              <span className="font-bold text-navy text-sm">B · Services</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone Service">
                <select className={selectClass} value={form.phoneService} onChange={e => set('phoneService', e.target.value as any)}>
                  <option>Yes</option><option>No</option>
                </select>
              </Field>
              <Field label="Multiple Lines">
                <select className={selectClass} value={form.multipleLines} onChange={e => set('multipleLines', e.target.value as any)}>
                  <option>No</option><option>Yes</option><option>No phone service</option>
                </select>
              </Field>
              <Field label="Internet Service">
                <select className={selectClass} value={form.internetService} onChange={e => set('internetService', e.target.value as any)}>
                  <option>DSL</option><option>Fiber optic</option><option>No</option>
                </select>
              </Field>
              <Field label="Online Security">
                <select className={selectClass} value={form.onlineSecurity} onChange={e => set('onlineSecurity', e.target.value as any)}>
                  <option>No</option><option>Yes</option><option>No internet service</option>
                </select>
              </Field>
              <Field label="Online Backup">
                <select className={selectClass} value={form.onlineBackup} onChange={e => set('onlineBackup', e.target.value as any)}>
                  <option>No</option><option>Yes</option><option>No internet service</option>
                </select>
              </Field>
              <Field label="Device Protection">
                <select className={selectClass} value={form.deviceProtection} onChange={e => set('deviceProtection', e.target.value as any)}>
                  <option>No</option><option>Yes</option><option>No internet service</option>
                </select>
              </Field>
              <Field label="Tech Support">
                <select className={selectClass} value={form.techSupport} onChange={e => set('techSupport', e.target.value as any)}>
                  <option>No</option><option>Yes</option><option>No internet service</option>
                </select>
              </Field>
              <Field label="Streaming TV">
                <select className={selectClass} value={form.streamingTV} onChange={e => set('streamingTV', e.target.value as any)}>
                  <option>No</option><option>Yes</option><option>No internet service</option>
                </select>
              </Field>
              <Field label="Streaming Movies" >
                <select className={selectClass} value={form.streamingMovies} onChange={e => set('streamingMovies', e.target.value as any)}>
                  <option>No</option><option>Yes</option><option>No internet service</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Section C */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CreditCard size={14} className="text-emerald-600" />
              </div>
              <span className="font-bold text-navy text-sm">C · Billing & Contract</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contract">
                <select className={selectClass} value={form.contract} onChange={e => set('contract', e.target.value as any)}>
                  <option>Month-to-month</option><option>One year</option><option>Two year</option>
                </select>
              </Field>
              <Field label="Paperless Billing">
                <select className={selectClass} value={form.paperlessBilling} onChange={e => set('paperlessBilling', e.target.value as any)}>
                  <option>No</option><option>Yes</option>
                </select>
              </Field>
              <div className="col-span-2">
                <Field label="Payment Method">
                  <select className={selectClass} value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value as any)}>
                    <option>Electronic check</option>
                    <option>Mailed check</option>
                    <option>Bank transfer (automatic)</option>
                    <option>Credit card (automatic)</option>
                  </select>
                </Field>
              </div>
              <Field label="Monthly Charges ($)" error={errors.monthlyCharges}>
                <input
                  type="number" min={0} step={0.01} value={form.monthlyCharges}
                  onChange={e => set('monthlyCharges', parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </Field>
              <Field label="Total Charges ($)" error={errors.totalCharges}>
                <input
                  type="number" min={0} step={0.01} value={form.totalCharges}
                  onChange={e => set('totalCharges', parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-electric text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing…</> : <><Zap size={18} /> Analyze Customer</>}
          </button>
        </form>

        {/* RIGHT: Results */}
        <div>
          {loading && (
            <div className="card p-8 flex flex-col items-center justify-center min-h-64">
              <Loader2 size={32} className="text-electric animate-spin mb-3" />
              <p className="text-slate-500 text-sm font-medium">Running demo analysis…</p>
            </div>
          )}
          {!loading && !result && (
            <div className="card p-8 flex flex-col items-center justify-center min-h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Zap size={28} className="text-electric" />
              </div>
              <h3 className="text-navy font-bold text-lg mb-2">Ready to Analyze</h3>
              <p className="text-slate-400 text-sm max-w-xs">
                Fill in the customer form on the left and click <strong>Analyze Customer</strong> to see a simulated churn risk prediction.
              </p>
            </div>
          )}
          {!loading && result && (
            <ResultPanel result={result} input={form} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictPage;

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingDown, TrendingUp, BarChart3, ArrowRight, AlertTriangle, CheckCircle, Minus, Brain, Database, FlaskConical, Layers } from 'lucide-react';
import type { Page } from '../components/Sidebar';
import { DEMO_CUSTOMERS } from '../data/demoCustomers';
import type { CustomerInput } from '../types/customer';

interface OverviewPageProps {
  onNavigate: (page: Page) => void;
  onLoadExample: (input: CustomerInput) => void;
}

const donutData = [
  { name: 'Retained', value: 5174 },
  { name: 'Churned', value: 1869 },
];
const COLORS = ['#2563eb', '#f97316'];

const kpis = [
  {
    label: 'Total Customers',
    value: 7043,
    formatted: '7,043',
    icon: Users,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-100',
    subtitle: 'in the Telco dataset',
  },
  {
    label: 'Customers Retained',
    value: 5174,
    formatted: '5,174',
    icon: TrendingUp,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    subtitle: '73.46% of total',
  },
  {
    label: 'Customers Churned',
    value: 1869,
    formatted: '1,869',
    icon: TrendingDown,
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-100',
    subtitle: '26.54% of total',
  },
  {
    label: 'TabPFN ROC-AUC',
    value: 85,
    formatted: '85.00%',
    icon: BarChart3,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-100',
    subtitle: 'Offline test-set result',
  },
];

const workflowSteps = [
  { icon: Database, label: 'Load Dataset', desc: 'Telco Customer Churn CSV', color: 'text-blue-500' },
  { icon: Layers, label: 'Preprocess', desc: 'Encode & split features', color: 'text-purple-500' },
  { icon: Brain, label: 'Train TabPFN', desc: 'In-context learning', color: 'text-cyan-500' },
  { icon: BarChart3, label: 'Evaluate', desc: 'ROC-AUC 85%', color: 'text-emerald-500' },
];

function useCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const KPICard: React.FC<{ kpi: typeof kpis[0]; index: number }> = ({ kpi, index }) => {
  const Icon = kpi.icon;
  const counter = useCounter(kpi.value, 800 + index * 200);
  const display = kpi.formatted.includes('%')
    ? `${((counter / kpi.value) * parseFloat(kpi.formatted)).toFixed(2)}%`
    : counter.toLocaleString();

  return (
    <div className={`card p-5 border ${kpi.borderColor} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${kpi.bgLight} flex items-center justify-center`}>
          <Icon size={20} className={kpi.textColor} />
        </div>
        <span className={`text-xs font-semibold ${kpi.textColor} ${kpi.bgLight} px-2 py-1 rounded-full`}>
          {kpi.subtitle}
        </span>
      </div>
      <div className={`text-3xl font-bold ${kpi.textColor} animate-count`}>{display}</div>
      <div className="text-sm text-slate-500 mt-1 font-medium">{kpi.label}</div>
    </div>
  );
};

const riskColors: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  High: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: <AlertTriangle size={16} className="text-red-500" />,
  },
  Medium: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: <Minus size={16} className="text-amber-500" />,
  },
  Low: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: <CheckCircle size={16} className="text-emerald-500" />,
  },
};

const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate, onLoadExample }) => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden relative bg-navy shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-navy to-purple-900/40 pointer-events-none" />
        <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
              <FlaskConical size={12} className="text-cyan-300" />
              <span className="text-xs text-cyan-200 font-semibold tracking-wide">VIT-AP University · ML Lab Mini Project</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-3">
              Understand customer churn<br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                before it happens.
              </span>
            </h1>
            <p className="text-blue-100 text-base max-w-lg leading-relaxed mb-6">
              Explore customer profiles, examine simulated churn-risk predictions, and discover the factors
              associated with customer retention — powered by TabPFN.
            </p>
            <button
              onClick={() => onNavigate('predict')}
              className="inline-flex items-center gap-2 px-6 py-3 gradient-electric text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Predict Customer Churn
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="w-48 h-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [Number(value ?? 0).toLocaleString(), ''] as [string, string]}
                  contentStyle={{ background: '#1e2d4a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 -mt-2">
              {donutData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-xs text-blue-200">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Workflow + Example Customers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Workflow */}
        <div className="card p-6">
          <h2 className="text-navy font-bold text-lg mb-5">Project Workflow</h2>
          <div className="space-y-3">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center`}>
                      <Icon size={18} className={step.color} />
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className="w-px h-5 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-navy text-sm">{step.label}</div>
                    <div className="text-slate-500 text-xs">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
      
        </div>

        {/* Example Customers */}
        <div className="card p-6">
          <h2 className="text-navy font-bold text-lg mb-2">Example Customer Profiles</h2>
          <p className="text-slate-500 text-sm mb-5">Click any profile to load it into the prediction form.</p>
          <div className="space-y-3">
            {DEMO_CUSTOMERS.map((demo) => {
              const colors = riskColors[demo.riskLevel];
              return (
                <button
                  key={demo.id}
                  onClick={() => {
                    onLoadExample(demo.input);
                    onNavigate('predict');
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-150 group text-left`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {colors.icon}
                      <span className={`font-bold text-sm ${colors.text}`}>{demo.riskLevel} Risk</span>
                    </div>
                    <span className="text-slate-600 text-sm">{demo.description}</span>
                  </div>
                  <ArrowRight size={16} className={`${colors.text} group-hover:translate-x-1 transition-transform`} />
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onNavigate('predict')}
            className="mt-4 w-full py-2.5 text-sm font-semibold text-electric border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Or build a custom customer profile →
          </button>
        </div>
      </div>

      {/* Demo disclaimer */}
      <div className="flex items-center justify-center gap-2 py-2">
        <FlaskConical size={14} className="text-amber-500" />
        <span className="text-xs text-amber-600 font-semibold">
          DEMO MODE · Simulated predictions · Live model inference is not connected
        </span>
      </div>
    </div>
  );
};

export default OverviewPage;

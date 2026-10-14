import React from 'react';
import {
  Database, Layers, Scissors, SplitSquareVertical, Shuffle,
  Code2, Brain, BarChart3, Lightbulb, GraduationCap, Users, FlaskConical
} from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: '1. Dataset Loading & Inspection',
    description:
      'The Telco Customer Churn dataset was loaded using pandas. It contains 7,043 rows and 21 columns. Basic exploration was performed to understand data types, value counts, and summary statistics.',
    color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100',
  },
  {
    icon: Layers,
    title: '2. Data Preparation & Numeric Handling',
    description:
      'The TotalCharges column was converted from object to numeric type. Eleven rows with tenure = 0 and blank TotalCharges were identified and filled with 0 to maintain dataset integrity.',
    color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100',
  },
  {
    icon: Scissors,
    title: '3. Removal of customerID',
    description:
      'The customerID column is a unique identifier and carries no predictive signal. It was dropped before feature construction to avoid data leakage and meaningless one-hot encoding.',
    color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100',
  },
  {
    icon: SplitSquareVertical,
    title: '4. Feature & Target Separation',
    description:
      'The dataset was split into X (19 input features) and y (the Churn binary label: 0 = stayed, 1 = churned). This separation is required before any preprocessing or model training.',
    color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100',
  },
  {
    icon: Shuffle,
    title: '5. Stratified Train / Test Split',
    description:
      'A stratified split was used (80% train, 20% test) to preserve the class imbalance ratio in both partitions. This ensures evaluation metrics reflect real-world performance.',
    color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100',
  },
  {
    icon: Code2,
    title: '6. One-Hot Encoding of Categorical Variables',
    description:
      'All categorical features (gender, contract type, payment method, etc.) were one-hot encoded using pd.get_dummies(). This produced 16 categorical and 5 numerical features after encoding.',
    color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100',
  },
  {
    icon: Brain,
    title: '7. TabPFN Training & Evaluation',
    description:
      'TabPFN (Tabular Prior-data Fitted Network) was instantiated and fitted on the training partition. No manual hyperparameter tuning is needed — TabPFN performs in-context Bayesian inference over the dataset. Prediction probabilities were obtained for the test set.',
    color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
  },
  {
    icon: BarChart3,
    title: '8. Classification Metric Evaluation',
    description:
      'The model was evaluated using Accuracy (80.70%), Precision (67.59%), Recall (52.41%), F1-Score (59.04%), and ROC-AUC (85.00%) on 1,409 held-out test samples. The precision-recall trade-off was explored using a validation-tuned threshold.',
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100',
  },
  {
    icon: Lightbulb,
    title: '9. Feature Importance & Model Explanations',
    description:
      'Post-hoc explainability methods were explored to understand which features drive predictions. Contract type, tenure, internet service type, and payment method consistently appeared as influential factors in this dataset.',
    color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
   
{/* Header */}
<div
  className="card p-6 sm:p-8 text-white border-0 overflow-hidden"
  style={{ backgroundColor: '#111B32' }}
>
  <div className="mb-6">
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 border border-cyan-300/30 bg-cyan-300/10">
      <FlaskConical size={14} className="text-cyan-300" />
      <span className="text-sm text-cyan-200 font-semibold">
        ML Lab Mini Project
      </span>
    </div>

    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
      Predicting Customer Churn
      <span className="block text-cyan-300 mt-1">
        with TabPFN
      </span>
    </h2>

    <p className="text-slate-300 text-base max-w-3xl leading-relaxed">
      An exploration of whether customer information from a
      telecommunications dataset can help identify customers likely
      to leave the service using TabPFN, a transformer-based model
      for tabular data.
    </p>
  </div>

  <div className="grid sm:grid-cols-3 gap-4">
    {/* Students */}
    <div className="rounded-xl p-4 border border-white/10 bg-white/5">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap size={18} className="text-cyan-300" />
        <span className="text-xs text-cyan-200 font-bold uppercase tracking-widest">
          Project Team
        </span>
      </div>

      <div className="mb-4">
        <div className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
          Piyush Patel
        </div>
        <div className="text-sm text-slate-300 mt-1">
          24BCB7172
        </div>
      </div>

      <div>
        <div className="text-lg sm:text-xl font-bold tracking-tight text-white">
          Jayita
        </div>
        <div className="text-sm text-slate-300 mt-1">
          24BCB7032
        </div>
      </div>
    </div>

    {/* Programme */}
    <div className="rounded-xl p-4 border border-white/10 bg-white/5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-cyan-300" />
        <span className="text-xs text-cyan-200 font-bold uppercase tracking-widest">
          Programme
        </span>
      </div>

      <div className="text-lg font-bold text-white leading-relaxed">
        B.Tech Computer Science
      </div>
      <div className="text-sm text-slate-300 mt-1">
        & Business Systems
      </div>
    </div>

    {/* University */}
    <div className="rounded-xl p-4 border border-white/10 bg-white/5">
      <div className="flex items-center gap-2 mb-4">
        <Database size={18} className="text-cyan-300" />
        <span className="text-xs text-cyan-200 font-bold uppercase tracking-widest">
          University
        </span>
      </div>

      <div className="text-lg font-bold text-white leading-relaxed">
        VIT-AP University
      </div>
      <div className="text-sm text-slate-300 mt-1">
        Amaravati, Andhra Pradesh
      </div>
    </div>
  </div>
</div>
```
      {/* Methodology */}
      <div>
        <h3 className="text-xl font-bold text-navy mb-5">Methodology</h3>
        <div className="space-y-4">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.title} className={`card p-5 border ${step.border} flex gap-4`}>
                <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={20} className={step.color} />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">{step.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo vs notebook note */}
     

      {/* Tech stack */}
      <div className="card p-5">
        <h3 className="font-bold text-navy mb-4">Technology Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'React 19', desc: 'UI framework', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { name: 'TypeScript', desc: 'Type safety', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
            { name: 'Tailwind CSS', desc: 'Styling', color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
            { name: 'Vite', desc: 'Build tool', color: 'bg-purple-50 text-purple-700 border-purple-100' },
            { name: 'Recharts', desc: 'Data viz', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { name: 'Lucide Icons', desc: 'Icon library', color: 'bg-orange-50 text-orange-700 border-orange-100' },
            { name: 'TabPFN', desc: 'ML model (notebook)', color: 'bg-slate-50 text-slate-700 border-slate-200' },
            { name: 'Python / pandas', desc: 'Data pipeline', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
          ].map(t => (
            <div key={t.name} className={`p-3 rounded-xl border ${t.color}`}>
              <div className="font-bold text-sm">{t.name}</div>
              <div className="text-xs opacity-70 mt-0.5">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

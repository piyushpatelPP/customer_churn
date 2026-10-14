import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Info, Database } from 'lucide-react';

// ─── Recorded notebook metrics ───────────────────────────────────────────────
// These are the OFFLINE evaluation results from the Jupyter notebook.
// They are NOT recalculated by this website.

const metrics = [
  { label: 'Accuracy', value: 80.70, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', bar: '#2563eb' },
  { label: 'Precision', value: 67.59, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', bar: '#8b5cf6' },
  { label: 'Recall', value: 52.41, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', bar: '#f59e0b' },
  { label: 'F1 Score', value: 59.04, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', bar: '#06b6d4' },
  { label: 'ROC-AUC', value: 85.00, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', bar: '#10b981' },
];

// Multi-model comparison (from notebook results table)
const modelComparison = [
  { model: 'TabPFN', accuracy: 78.1, precision: 57.6, recall: 67.6, f1: 62.2, rocAuc: 84.2 },
  { model: 'XGBoost', accuracy: 74.4, precision: 51.2, recall: 74.0, f1: 60.6, rocAuc: 83.1 },
  { model: 'Random Forest', accuracy: 75.5, precision: 52.8, recall: 73.3, f1: 61.4, rocAuc: 83.3 },
  { model: 'Logistic Reg.', accuracy: 74.0, precision: 57.1, recall: 68.3, f1: 62.2, rocAuc: 83.4 },
];

const radarData = metrics.map(m => ({ metric: m.label, value: m.value }));

// Confusion matrix — offline notebook evaluation results
// TabPFN on held-out test set (1,409 samples)
const confusionMatrix = {
  trueNegative: 941,  // Actual Stay, Predicted Stay
  falsePositive: 94,  // Actual Stay, Predicted Churn
  falseNegative: 178, // Actual Churn, Predicted Stay
  truePositive: 196,  // Actual Churn, Predicted Churn
};
const total = 1409;

const PerformancePage: React.FC = () => {
  const { trueNegative: TN, falsePositive: FP, falseNegative: FN, truePositive: TP } = confusionMatrix;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-navy mb-1">Model Performance</h2>
        <p className="text-slate-500 text-sm">
          Offline evaluation results recorded from the Jupyter notebook. Not recalculated by this website.
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
          <Info size={12} className="text-slate-500" />
          <span className="text-xs text-slate-600 font-semibold">
            Offline notebook evaluation results · Test set: {total.toLocaleString()} samples
          </span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map(m => (
          <div key={m.label} className={`card p-4 border ${m.border} text-center`}>
            <div className={`text-3xl font-bold ${m.color} mb-1`}>{m.value.toFixed(2)}%</div>
            <div className="text-sm font-semibold text-slate-500">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="card p-5">
          <h3 className="font-bold text-navy mb-4">Metric Radar — TabPFN</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="TabPFN" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)}%`, '']} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion matrix */}
        <div className="card p-5">
          <h3 className="font-bold text-navy mb-1">Confusion Matrix</h3>
          <p className="text-xs text-slate-400 mb-4">TabPFN · held-out test partition · {total.toLocaleString()} total samples</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-slate-400 font-medium text-xs text-left"></th>
                  <th className="p-2 text-center">
                    <div className="text-xs font-semibold text-slate-500">Predicted Stay</div>
                  </th>
                  <th className="p-2 text-center">
                    <div className="text-xs font-semibold text-slate-500">Predicted Churn</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 pr-4">
                    <div className="text-xs font-semibold text-slate-500">Actual Stay</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-3">
                      <div className="text-2xl font-bold text-emerald-700">{TN}</div>
                      <div className="text-xs text-emerald-600 font-medium">True Negative</div>
                      <div className="text-xs text-slate-400 mt-0.5">{((TN / total) * 100).toFixed(1)}%</div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="bg-amber-100 border border-amber-200 rounded-xl p-3">
                      <div className="text-2xl font-bold text-amber-700">{FP}</div>
                      <div className="text-xs text-amber-600 font-medium">False Positive</div>
                      <div className="text-xs text-slate-400 mt-0.5">{((FP / total) * 100).toFixed(1)}%</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 pr-4">
                    <div className="text-xs font-semibold text-slate-500">Actual Churn</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="bg-red-100 border border-red-200 rounded-xl p-3">
                      <div className="text-2xl font-bold text-red-700">{FN}</div>
                      <div className="text-xs text-red-600 font-medium">False Negative</div>
                      <div className="text-xs text-slate-400 mt-0.5">{((FN / total) * 100).toFixed(1)}%</div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="bg-blue-100 border border-blue-200 rounded-xl p-3">
                      <div className="text-2xl font-bold text-blue-700">{TP}</div>
                      <div className="text-xs text-blue-600 font-medium">True Positive</div>
                      <div className="text-xs text-slate-400 mt-0.5">{((TP / total) * 100).toFixed(1)}%</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            TabPFN correctly identified {TN} non-churners and {TP} churners. {FN} actual churners were missed.
          </p>
        </div>
      </div>

      {/* Model comparison bar chart */}
      <div className="card p-5">
        <h3 className="font-bold text-navy mb-1">Model Comparison — Notebook Results</h3>
        <p className="text-xs text-slate-400 mb-4">
          Four models were evaluated in the notebook. ROC-AUC scores shown (all models use validation-tuned thresholds).
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={modelComparison} barSize={22} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="model" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, '']} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="rocAuc" name="ROC-AUC" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="f1" name="F1 Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recall" name="Recall" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 mt-2 italic">
          TabPFN achieves the highest ROC-AUC (84.2). All scores from the notebook held-out test partition.
        </p>
      </div>

      {/* Cross-validation summary */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Database size={16} className="text-blue-500" />
          <h3 className="font-bold text-navy">5-Fold Cross-Validation Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Model</th>
                <th className="text-center p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ROC-AUC mean ± SD</th>
                <th className="text-center p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">PR-AUC mean ± SD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { model: 'TabPFN', roc: '0.853 ± .016', pr: '0.655 ± .061' },
                { model: 'Random Forest', roc: '0.851 ± .020', pr: '0.647 ± .056' },
                { model: 'Logistic Regression', roc: '0.848 ± .019', pr: '0.622 ± .059' },
                { model: 'XGBoost', roc: '0.831 ± .017', pr: '0.643 ± .053' },
              ].map((row, i) => (
                <tr key={row.model} className={i === 0 ? 'bg-blue-50 font-semibold' : ''}>
                  <td className="p-3 text-navy text-sm">{row.model}{i === 0 && <span className="ml-2 text-xs text-blue-500 font-bold">★ Best ROC-AUC</span>}</td>
                  <td className="p-3 text-center text-sm font-mono text-slate-600">{row.roc}</td>
                  <td className="p-3 text-center text-sm font-mono text-slate-600">{row.pr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3 italic">
          Cross-validation results from the notebook. TabPFN leads on ROC-AUC. All four models are competitive.
        </p>
      </div>
    </div>
  );
};

export default PerformancePage;

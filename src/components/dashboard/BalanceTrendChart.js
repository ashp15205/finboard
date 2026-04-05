import React from 'react';
import { useApp } from '../../hooks/useApp';
import { getMonthlyData, formatCurrencyCompact } from '../../utils/finance';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '12px 14px',
      boxShadow: 'var(--shadow-md)',
      minWidth: '160px',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.name}</span>
          <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {formatCurrencyCompact(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrendChart() {
  const { state } = useApp();
  const data = getMonthlyData(state.transactions);

  return (
    <div className="chart-card fade-up fade-up-1">
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">Income vs Expenses</div>
          <div className="chart-card-sub">Monthly breakdown over 6 months</div>
        </div>
        <div style={{ display: 'flex', gap: '14px' }}>
          {[
            { color: '#1D6B4A', label: 'Income' },
            { color: '#B83232', label: 'Expenses' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1D6B4A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1D6B4A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B83232" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#B83232" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatCurrencyCompact} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={56} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#1D6B4A" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4, fill: '#1D6B4A', strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#B83232" strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4, fill: '#B83232', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

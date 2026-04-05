import React from 'react';
import { useApp } from '../../hooks/useApp';
import { getCategoryBreakdown, formatCurrencyCompact } from '../../utils/finance';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#1D6B4A', '#B83232', '#1A4A9A', '#9A5C0A', '#6B3B8A', '#1A7A8A', '#8A4A1A', '#4A6B1A', '#8A1A4A'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{d.payload.pct}% of spending</div>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { state } = useApp();
  const breakdown = getCategoryBreakdown(state.transactions).slice(0, 7);

  return (
    <div className="chart-card fade-up fade-up-2">
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">Spending Breakdown</div>
          <div className="chart-card-sub">By category</div>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '13px' }}>
          No expense data
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                dataKey="value"
                strokeWidth={0}
              >
                {breakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="donut-legend">
            {breakdown.slice(0, 5).map((item, i) => (
              <div key={item.name} className="legend-item">
                <span className="cat-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{item.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>({item.pct}%)</span>
                <span className="legend-value">{formatCurrencyCompact(item.value)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

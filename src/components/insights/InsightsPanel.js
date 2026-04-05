import React from 'react';
import { useApp } from '../../hooks/useApp';
import { getInsights, getCategoryBreakdown, getMonthlyData, formatCurrency, formatCurrencyCompact } from '../../utils/finance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Award, Target, Zap } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ fontSize: '13px', fontWeight: 600, color: p.dataKey === 'income' ? '#1D6B4A' : '#B83232' }}>
          {p.name}: {formatCurrencyCompact(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function InsightsPanel() {
  const { state } = useApp();
  const insights = getInsights(state.transactions);
  const breakdown = getCategoryBreakdown(state.transactions);
  const monthly = getMonthlyData(state.transactions);
  const changeNum = parseFloat(insights.expenseChange);

  return (
    <div>
      {/* Insight Cards */}
      <div className="insights-grid">
        <div className="insight-card fade-up fade-up-1">
          <div className="insight-label">Top Spending Category</div>
          <div className="insight-value">{insights.topCategory?.name || '—'}</div>
          <div className="insight-desc">
            {insights.topCategory
              ? `You spent ${formatCurrency(insights.topCategory.value)} on ${insights.topCategory.name} — ${insights.topCategory.pct}% of total expenses.`
              : 'No expense data available.'}
          </div>
          {insights.topCategory && <span className="insight-chip chip-red"><Award size={12} />{insights.topCategory.pct}% of spending</span>}
        </div>

        <div className="insight-card fade-up fade-up-2">
          <div className="insight-label">Month-over-Month Expenses</div>
          <div className="insight-value" style={{ color: changeNum > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {changeNum > 0 ? '+' : ''}{insights.expenseChange}%
          </div>
          <div className="insight-desc">
            This month: {formatCurrency(insights.thisMonthExpenses)} vs last month: {formatCurrency(insights.lastMonthExpenses)}
          </div>
          <span className={`insight-chip ${changeNum > 0 ? 'chip-red' : 'chip-green'}`}>
            {changeNum > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {changeNum > 0 ? 'Spending up' : 'Spending down'}
          </span>
        </div>

        <div className="insight-card fade-up fade-up-3">
          <div className="insight-label">Largest Single Expense</div>
          <div className="insight-value">{insights.largestExpense ? formatCurrency(insights.largestExpense.amount) : '—'}</div>
          <div className="insight-desc">
            {insights.largestExpense
              ? `${insights.largestExpense.description} on ${insights.largestExpense.date}`
              : 'No expense data.'}
          </div>
          {insights.largestExpense && <span className="insight-chip chip-amber"><Zap size={12} />{insights.largestExpense.category}</span>}
        </div>

        <div className="insight-card fade-up fade-up-4">
          <div className="insight-label">Savings Rate</div>
          <div className="insight-value" style={{ color: parseFloat(insights.savingsRate) >= 20 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
            {insights.savingsRate}%
          </div>
          <div className="insight-desc">
            {parseFloat(insights.savingsRate) >= 20
              ? 'Great job! You\'re saving more than 20% of your income.'
              : 'Consider reducing expenses to improve your savings rate.'}
          </div>
          <span className={`insight-chip ${parseFloat(insights.savingsRate) >= 20 ? 'chip-green' : 'chip-amber'}`}>
            <Target size={12} />
            {parseFloat(insights.savingsRate) >= 20 ? 'On track' : 'Needs attention'}
          </span>
        </div>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="chart-card" style={{ marginBottom: '16px' }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-card-title">Monthly Income vs Expenses</div>
            <div className="chart-card-sub">Side-by-side comparison</div>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            {[{ color: '#1D6B4A', label: 'Income' }, { color: '#B83232', label: 'Expenses' }].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrencyCompact} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={56} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-surface-2)' }} />
            <Bar dataKey="income" name="Income" fill="#1D6B4A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#B83232" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Table */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-card-title">Category Breakdown</div>
            <div className="chart-card-sub">All-time spending by category</div>
          </div>
        </div>
        {breakdown.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: '13px' }}>No expense data</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            {breakdown.map((item, i) => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{formatCurrency(item.value)} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({item.pct}%)</span></span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${item.pct}%`,
                    background: ['#1D6B4A', '#B83232', '#1A4A9A', '#9A5C0A', '#6B3B8A', '#1A7A8A', '#8A4A1A'][i % 7],
                    borderRadius: '99px',
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

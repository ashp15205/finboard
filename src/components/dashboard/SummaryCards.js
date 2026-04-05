import React from 'react';
import { useApp } from '../../hooks/useApp';
import { getTotals, formatCurrency } from '../../utils/finance';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

export default function SummaryCards() {
  const { state } = useApp();
  const { income, expenses, balance, savingsRate } = getTotals(state.transactions);

  const cards = [
    {
      label: 'Total Balance',
      value: formatCurrency(balance),
      sub: 'Net across all time',
      icon: Wallet,
      iconClass: 'icon-bg-blue',
      valueClass: balance >= 0 ? 'card-accent-blue' : 'card-accent-red',
      delay: 'fade-up-1',
    },
    {
      label: 'Total Income',
      value: formatCurrency(income),
      sub: 'All income sources',
      icon: TrendingUp,
      iconClass: 'icon-bg-green',
      valueClass: 'card-accent-green',
      delay: 'fade-up-2',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(expenses),
      sub: 'All spending',
      icon: TrendingDown,
      iconClass: 'icon-bg-red',
      valueClass: 'card-accent-red',
      delay: 'fade-up-3',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      sub: 'Of total income saved',
      icon: PiggyBank,
      iconClass: parseFloat(savingsRate) >= 20 ? 'icon-bg-green' : 'icon-bg-amber',
      valueClass: parseFloat(savingsRate) >= 20 ? 'card-accent-green' : 'card-accent-amber',
      delay: 'fade-up-4',
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map(({ label, value, sub, icon: Icon, iconClass, valueClass, delay }) => (
        <div key={label} className={`summary-card fade-up ${delay}`}>
          <div className={`summary-card-icon ${iconClass}`}>
            <Icon size={18} className={valueClass} />
          </div>
          <div className="summary-card-label">{label}</div>
          <div className={`summary-card-value ${valueClass}`}>{value}</div>
          <div className="summary-card-sub">{sub}</div>
        </div>
      ))}
    </div>
  );
}

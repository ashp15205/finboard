import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import { formatCurrency } from './utils/finance';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import SummaryCards from './components/dashboard/SummaryCards';
import BalanceTrendChart from './components/dashboard/BalanceTrendChart';
import SpendingBreakdown from './components/dashboard/SpendingBreakdown';
import TransactionList from './components/transactions/TransactionList';
import InsightsPanel from './components/insights/InsightsPanel';
import './index.css';

function RecentTransactions() {
  const { state, dispatch } = useApp();
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="chart-card" style={{ marginTop: '16px' }}>
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">Recent Transactions</div>
          <div className="chart-card-sub">Last 5 entries</div>
        </div>
        <button
          className="btn btn-ghost"
          style={{ fontSize: '13px', height: 32 }}
          onClick={() => dispatch({ type: 'SET_SECTION', payload: 'transactions' })}
        >
          View all →
        </button>
      </div>
      <div>
        {recent.map((tx, i) => (
          <div key={tx.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 0',
            borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
              background: tx.type === 'income' ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 700,
              color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)',
            }}>
              {tx.type === 'income' ? '↑' : '↓'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tx.description}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
                {format(parseISO(tx.date), 'dd MMM yyyy')} · {tx.category}
              </div>
            </div>
            <div style={{
              fontSize: '14px', fontWeight: 600, flexShrink: 0, fontVariantNumeric: 'tabular-nums',
              color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)',
            }}>
              {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (state.activeSection) {
      case 'overview': return (
        <>
          <SummaryCards />
          <div className="chart-grid">
            <BalanceTrendChart />
            <SpendingBreakdown />
          </div>
          <RecentTransactions />
        </>
      );
      case 'transactions': return <TransactionList />;
      case 'insights': return <InsightsPanel />;
      default: return null;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-content">{renderSection()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppProvider><Dashboard /></AppProvider>;
}

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Sun, Moon, Menu, ChevronDown, ShieldCheck, Eye, Download } from 'lucide-react';
import { applyFilters } from '../../utils/finance';

const SECTION_META = {
  overview: { title: 'Overview', subtitle: 'Your financial summary at a glance' },
  transactions: { title: 'Transactions', subtitle: 'All your income and expenses' },
  insights: { title: 'Insights', subtitle: 'Understand your spending patterns' },
};

export default function Topbar({ onMenuClick }) {
  const { state, dispatch } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);
  const dropdownRef = useRef(null);
  const meta = SECTION_META[state.activeSection] || SECTION_META.overview;

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setRoleOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const setRole = (role) => { dispatch({ type: 'SET_ROLE', payload: role }); setRoleOpen(false); };

  const handleExport = () => {
    const filtered = applyFilters(state.transactions, {
      searchQuery: state.searchQuery,
      filterCategory: state.filterCategory,
      filterType: state.filterType,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    });
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filtered.map(t => [t.date, `"${t.description}"`, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'finboard-transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onMenuClick}><Menu size={18} /></button>
        <div>
          <div className="page-title">{meta.title}</div>
          <div className="page-subtitle">{meta.subtitle}</div>
        </div>
      </div>

      <div className="topbar-right">
        {state.activeSection === 'transactions' && (
          <button className="btn btn-ghost" onClick={handleExport} style={{ gap: '5px' }}>
            <Download size={14} />
            <span style={{ fontSize: '13px' }}>Export</span>
          </button>
        )}

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button className="role-badge" onClick={() => setRoleOpen(p => !p)}>
            <span className={`role-dot ${state.role}`} />
            {state.role === 'admin' ? 'Admin' : 'Viewer'}
            <ChevronDown size={12} />
          </button>
          {roleOpen && (
            <div className="role-dropdown">
              <div className="role-option" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '2px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, cursor: 'default' }}>
                Switch Role
              </div>
              <div className={`role-option ${state.role === 'admin' ? 'selected' : ''}`} onClick={() => setRole('admin')}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-green)' }} /> Admin
                {state.role === 'admin' && <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)' }}>active</span>}
              </div>
              <div className={`role-option ${state.role === 'viewer' ? 'selected' : ''}`} onClick={() => setRole('viewer')}>
                <Eye size={14} style={{ color: 'var(--accent-amber)' }} /> Viewer
                {state.role === 'viewer' && <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)' }}>active</span>}
              </div>
            </div>
          )}
        </div>

        <button className="theme-toggle" onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
          {state.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}

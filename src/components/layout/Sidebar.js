import React from 'react';
import { useApp } from '../../hooks/useApp';
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useApp();

  const setSection = (id) => {
    dispatch({ type: 'SET_SECTION', payload: id });
    onClose();
  };

  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.3" />
              </svg>
            </div>
            <div>
              <div className="logo-text">FinBoard</div>
              <div className="logo-sub">Finance Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${state.activeSection === id ? 'active' : ''}`}
              onClick={() => setSection(id)}
            >
              <Icon size={16} className="nav-icon" />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ padding: '12px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Current Role</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={`role-dot ${state.role}`} />
              {state.role === 'admin' ? 'Admin' : 'Viewer'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {state.role === 'admin' ? 'Full access enabled' : 'Read-only access'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

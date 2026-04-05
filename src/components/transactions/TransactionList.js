import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { applyFilters, formatCurrency } from '../../utils/finance';
import { CATEGORIES } from '../../data/mockData';
import TransactionModal from './TransactionModal';
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { format, parseISO } from 'date-fns';

function SortIcon({ field, sortBy, sortOrder }) {
  if (sortBy !== field) return <span className="sort-icon"><ArrowUpDown size={12} /></span>;
  return <span className="sort-icon active">{sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}</span>;
}

export default function TransactionList() {
  const { state, dispatch } = useApp();
  const [modal, setModal] = useState(null); // null | 'add' | transaction object
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const isAdmin = state.role === 'admin';

  const filtered = applyFilters(state.transactions, {
    searchQuery: state.searchQuery,
    filterCategory: state.filterCategory,
    filterType: state.filterType,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  });

  const handleSort = (field) => {
    const newOrder = state.sortBy === field && state.sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch({ type: 'SET_SORT', payload: { sortBy: field, sortOrder: newOrder } });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    setDeleteConfirm(null);
  };

  const hasActiveFilters = state.searchQuery || state.filterCategory || state.filterType;

  return (
    <div>
      {/* Filters */}
      <div className="filters-row">
        <div className="search-input">
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            placeholder="Search transactions..."
            value={state.searchQuery}
            onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          />
          {state.searchQuery && (
            <button onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px', display: 'flex' }}>
              ✕
            </button>
          )}
        </div>

        <select
          className="filter-select"
          value={state.filterCategory}
          onChange={e => dispatch({ type: 'SET_FILTER_CATEGORY', payload: e.target.value })}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="filter-select"
          value={state.filterType}
          onChange={e => dispatch({ type: 'SET_FILTER_TYPE', payload: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {hasActiveFilters && (
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'RESET_FILTERS' })} style={{ gap: '5px' }}>
            <RotateCcw size={13} /> Reset
          </button>
        )}

        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')} style={{ marginLeft: 'auto' }}>
            <Plus size={15} /> Add Transaction
          </button>
        )}
      </div>

      {/* Count */}
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        {hasActiveFilters ? ' matching filters' : ''}
      </div>

      {/* Table */}
      <div className="tx-table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={22} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="empty-state-title">No transactions found</div>
            <div className="empty-state-sub">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Add a transaction to get started'}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th className={state.sortBy === 'date' ? 'sorted' : ''} onClick={() => handleSort('date')}>
                    Date <SortIcon field="date" sortBy={state.sortBy} sortOrder={state.sortOrder} />
                  </th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th className={state.sortBy === 'amount' ? 'sorted' : ''} onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>
                    Amount <SortIcon field="amount" sortBy={state.sortBy} sortOrder={state.sortOrder} />
                  </th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td className="tx-date">{format(parseISO(tx.date), 'dd MMM yyyy')}</td>
                    <td className="tx-description">{tx.description}</td>
                    <td>
                      <span className="category-pill">{tx.category}</span>
                    </td>
                    <td>
                      <span className={`type-badge ${tx.type}`}>
                        {tx.type === 'income' ? '↑ Income' : '↓ Expense'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                        {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setModal(tx)}
                            style={{ width: 30, height: 30, border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
                          ><Pencil size={13} /></button>
                          <button
                            onClick={() => setDeleteConfirm(tx.id)}
                            style={{ width: 30, height: 30, border: '1px solid transparent', borderRadius: '6px', background: 'var(--accent-red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent-red)' }}
                          ><Trash2 size={13} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title" style={{ fontSize: '16px' }}>Delete Transaction?</div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              This action cannot be undone.
            </p>
            <div className="modal-actions" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <TransactionModal
          transaction={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

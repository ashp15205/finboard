import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { CATEGORIES } from '../../data/mockData';
import { X } from 'lucide-react';

const empty = { description: '', category: 'Food', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0] };

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) setForm({ ...transaction, amount: String(transaction.amount) });
    else setForm(empty);
  }, [transaction]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { ...form, amount: Math.abs(Number(form.amount)), id: transaction?.id || `t${Date.now()}` };
    dispatch({ type: transaction ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION', payload });
    onClose();
  };

  const inputStyle = (field) => ({
    borderColor: errors[field] ? 'var(--accent-red)' : undefined,
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div className="modal-title">{transaction ? 'Edit Transaction' : 'Add Transaction'}</div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
          ><X size={15} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="e.g. Monthly Salary"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            style={inputStyle('description')}
          />
          {errors.description && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.description}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              min="0"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              style={inputStyle('amount')}
            />
            {errors.amount && <div style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{errors.amount}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              style={inputStyle('date')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-input form-select"
              value={form.type}
              onChange={e => set('type', e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input form-select"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {transaction ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

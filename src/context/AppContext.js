import React, { createContext, useReducer, useEffect } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

const STORAGE_KEY = 'finboard_state';

const defaultState = {
  transactions: INITIAL_TRANSACTIONS,
  role: 'viewer',
  theme: 'light',
  searchQuery: '',
  filterCategory: '',
  filterType: '',
  sortBy: 'date',
  sortOrder: 'desc',
  activeSection: 'overview',
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE': return { ...state, ...action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_ROLE': return { ...state, role: action.payload };
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_SEARCH': return { ...state, searchQuery: action.payload };
    case 'SET_FILTER_CATEGORY': return { ...state, filterCategory: action.payload };
    case 'SET_FILTER_TYPE': return { ...state, filterType: action.payload };
    case 'SET_SORT': return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'SET_SECTION': return { ...state, activeSection: action.payload };
    case 'RESET_FILTERS':
      return { ...state, searchQuery: '', filterCategory: '', filterType: '', sortBy: 'date', sortOrder: 'desc' };
    default: return state;
  }
}

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { transactions: parsed.transactions, role: parsed.role, theme: parsed.theme } });
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions: state.transactions, role: state.role, theme: state.theme }));
    } catch (e) {}
  }, [state.transactions, state.role, state.theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

import { format, parseISO, isSameMonth } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyCompact = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

export const getTotals = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
  return { income, expenses, balance, savingsRate };
};

export const getMonthlyData = (transactions) => {
  const months = {};
  transactions.forEach(t => {
    const month = format(parseISO(t.date), 'MMM yy');
    if (!months[month]) months[month] = { income: 0, expenses: 0, month };
    if (t.type === 'income') months[month].income += t.amount;
    else months[month].expenses += t.amount;
  });
  return Object.values(months).map(m => ({
    ...m,
    balance: m.income - m.expenses,
  }));
};

export const getCategoryBreakdown = (transactions) => {
  const cats = {};
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  expenses.forEach(t => {
    cats[t.category] = (cats[t.category] || 0) + t.amount;
  });
  return Object.entries(cats)
    .map(([name, value]) => ({ name, value, pct: total > 0 ? ((value / total) * 100).toFixed(1) : 0 }))
    .sort((a, b) => b.value - a.value);
};

export const getInsights = (transactions) => {
  const now = new Date();
  const thisMonth = transactions.filter(t => isSameMonth(parseISO(t.date), now));
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = transactions.filter(t => isSameMonth(parseISO(t.date), lastMonthDate));

  const thisMonthExpenses = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastMonthExpenses = lastMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const expenseChange = lastMonthExpenses > 0
    ? (((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
    : 0;

  const breakdown = getCategoryBreakdown(transactions);
  const topCategory = breakdown[0] || null;

  const largestExpense = [...transactions]
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0] || null;

  const { savingsRate } = getTotals(transactions);

  return { topCategory, expenseChange, largestExpense, savingsRate, thisMonthExpenses, lastMonthExpenses };
};

export const applyFilters = (transactions, { searchQuery, filterCategory, filterType, sortBy, sortOrder }) => {
  let result = [...transactions];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  if (filterCategory) result = result.filter(t => t.category === filterCategory);
  if (filterType) result = result.filter(t => t.type === filterType);

  result.sort((a, b) => {
    let valA = a[sortBy], valB = b[sortBy];
    if (sortBy === 'date') { valA = new Date(valA); valB = new Date(valB); }
    if (sortBy === 'amount') { valA = Number(valA); valB = Number(valB); }
    return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  return result;
};

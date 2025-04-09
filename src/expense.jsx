import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from './expenseform';
import ExpenseList from './expenselist';

const Expenses = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    type: 'expense',
    startDate: '',
    endDate: ''
  });
  const [activeTab, setActiveTab] = useState('expense');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const params = new URLSearchParams();
        if (filter.type) params.append('type', filter.type);
        if (filter.startDate) params.append('startDate', filter.startDate);
        if (filter.endDate) params.append('endDate', filter.endDate);
        
        const res = await axios.get(`/expenses?${params.toString()}`);
        setExpenses(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch expenses');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [filter]);

  const handleAddExpense = async (expenseData) => {
    try {
      const res = await axios.post('/expenses', expenseData);
      setExpenses([res.data, ...expenses]);
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '5px solid rgba(255,255,255,0.3)',
        borderTopColor: '#667eea',
        borderRadius: '50%',
        animation: 'spin 1s ease-in-out infinite',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.25rem',
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Expense Management</h1>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>Track and manage your financial transactions</p>
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(243, 244, 246, 0.7)',
            borderRadius: '12px',
            padding: '0.25rem'
          }}>
            <button
              onClick={() => {
                setFilter({...filter, type: 'expense'});
                setActiveTab('expense');
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'expense' ? 'white' : 'transparent',
                color: activeTab === 'expense' ? '#6366f1' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: activeTab === 'expense' ? '0 2px 8px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Expenses
            </button>
            <button
              onClick={() => {
                setFilter({...filter, type: 'income'});
                setActiveTab('income');
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'income' ? 'white' : 'transparent',
                color: activeTab === 'income' ? '#10b981' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: activeTab === 'income' ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Income
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(254, 226, 226, 0.9)',
            borderLeft: '4px solid #ef4444',
            color: '#b91c1c',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          {/* Expense Form */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(8px)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'expense' ? '#6366f1' : '#10b981'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New {activeTab === 'expense' ? 'Expense' : 'Income'}
            </h2>
            <ExpenseForm onSubmit={handleAddExpense} type={filter.type} />
          </div>

          {/* Expense List */}
          <div>
            {/* Filters */}
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>Filters</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>Start Date</label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: 'rgba(249, 250, 251, 0.7)',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    value={filter.startDate}
                    onChange={(e) => setFilter({...filter, startDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>End Date</label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: 'rgba(249, 250, 251, 0.7)',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    value={filter.endDate}
                    onChange={(e) => setFilter({...filter, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Expense List */}
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {activeTab === 'expense' ? 'Recent Expenses' : 'Recent Income'}
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {expenses.length} records
                </p>
              </div>
              <ExpenseList expenses={expenses} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
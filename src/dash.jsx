import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ user }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    recentExpenses: [],
    budgetAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const [expensesRes, incomesRes, budgetsRes] = await Promise.all([
          axios.get(`/expenses?type=expense&startDate=${firstDay.toISOString()}&endDate=${lastDay.toISOString()}`),
          axios.get(`/expenses?type=income&startDate=${firstDay.toISOString()}&endDate=${lastDay.toISOString()}`),
          axios.get('/budgets')
        ]);
        
        const totalExpenses = expensesRes.data.reduce((sum, exp) => sum + exp.amount, 0);
        const totalIncome = incomesRes.data.reduce((sum, inc) => sum + inc.amount, 0);
        
        const categoryTotals = expensesRes.data.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {});
        
        const budgetAlerts = budgetsRes.data.filter(budget => {
          return categoryTotals[budget.category] && categoryTotals[budget.category] > budget.limit;
        }).map(budget => ({
          category: budget.category,
          spent: categoryTotals[budget.category],
          limit: budget.limit,
          over: categoryTotals[budget.category] - budget.limit
        }));
        
        setSummary({
          totalIncome,
          totalExpenses,
          recentExpenses: expensesRes.data.slice(0, 5),
          budgetAlerts
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  const chartData = {
    labels: summary.recentExpenses.map(exp => exp.category),
    datasets: [
      {
        label: 'Recent Expenses',
        data: summary.recentExpenses.map(exp => exp.amount),
        backgroundColor: [
          'rgba(236, 72, 153, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          color: '#4b5563'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: '600'
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return ` ${context.label}: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    cutout: '75%',
    maintainAspectRatio: false
  };

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
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.25rem',
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Welcome back, {user?.username}</h1>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>Here's your financial overview for this month</p>
          </div>
          <div style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
          }}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}>
          {/* Income Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,244,0.95) 100%)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            border: '1px solid rgba(220, 252, 231, 0.5)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Total Income</h3>
              </div>
              <p style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                margin: '0.5rem 0',
                color: '#10b981',
                textShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
              }}>${summary.totalIncome.toFixed(2)}</p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>This month's total income</p>
            </div>
          </div>

          {/* Expenses Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,242,242,0.95) 100%)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            border: '1px solid rgba(254, 226, 226, 0.5)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Total Expenses</h3>
              </div>
              <p style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                margin: '0.5rem 0',
                color: '#ef4444',
                textShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
              }}>${summary.totalExpenses.toFixed(2)}</p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>This month's total expenses</p>
            </div>
          </div>

          {/* Balance Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            border: '1px solid rgba(219, 234, 254, 0.5)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Current Balance</h3>
              </div>
              <p style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                margin: '0.5rem 0',
                color: '#3b82f6',
                textShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
              }}>
                ${(summary.totalIncome - summary.totalExpenses).toFixed(2)}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>Your available balance</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gap: '2rem',
          marginBottom: '2.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))'
        }}>
          {/* Recent Transactions */}
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
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>Recent Transactions</h3>
              <Link to="/expenses" style={{
                color: '#6366f1',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}>
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {summary.recentExpenses.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {summary.recentExpenses.map((expense) => (
                  <div key={expense._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(249, 250, 251, 0.7)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.25rem'
                        }}>{expense.category}</p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          fontWeight: '500'
                        }}>
                          {expense.description || 'No description provided'}
                        </p>
                      </div>
                    </div>
                    <p style={{
                      fontWeight: '700',
                      color: '#ef4444',
                      fontSize: '1.1rem'
                    }}>-${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 0',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(243, 244, 246, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>No transactions yet</h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  maxWidth: '300px'
                }}>Your recent transactions will appear here once you start spending</p>
              </div>
            )}
          </div>

          {/* Expense Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(8px)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1.5rem'
            }}>Expense Distribution</h3>
            {summary.recentExpenses.length > 0 ? (
              <div style={{
                height: '350px',
                position: 'relative',
                margin: '0 auto',
                maxWidth: '400px'
              }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 0',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(243, 244, 246, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>No data to visualize</h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  maxWidth: '300px'
                }}>Your expense distribution chart will appear here once you have transactions</p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Alerts */}
        {summary.budgetAlerts.length > 0 && (
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
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(254, 226, 226, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>Budget Alerts</h3>
            </div>
            
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}>
              {summary.budgetAlerts.map((alert, index) => (
                <div key={index} style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(254,226,226,0.5) 0%, rgba(252,165,165,0.1) 100%)',
                  borderLeft: '4px solid #ef4444',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <p style={{
                      fontWeight: '600',
                      color: '#b91c1c',
                      fontSize: '1rem'
                    }}>
                      {alert.category} budget exceeded by ${alert.over.toFixed(2)}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{ color: '#9ca3af' }}>Spent:</span>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>${alert.spent.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{ color: '#9ca3af' }}>Budget Limit:</span>
                    <span style={{ color: '#1f2937', fontWeight: '600' }}>${alert.limit.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
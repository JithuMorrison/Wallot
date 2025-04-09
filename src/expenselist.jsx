import React from 'react';
import { format } from 'date-fns';

const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(8px)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: 'rgba(243, 244, 246, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: '0.5rem'
        }}>No transactions found</h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#9ca3af',
          maxWidth: '300px',
          margin: '0 auto'
        }}>Your transactions will appear here once you add them</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(8px)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4b5563">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Transaction History
        </h2>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          minWidth: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0'
        }}>
          <thead>
            <tr style={{
              background: 'rgba(249, 250, 251, 0.7)'
            }}>
              <th style={{
                padding: '1rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                Date
              </th>
              <th style={{
                padding: '1rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                Category
              </th>
              <th style={{
                padding: '1rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                Description
              </th>
              <th style={{
                padding: '1rem 1.5rem',
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                Amount
              </th>
              <th style={{
                padding: '1rem 1.5rem',
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr 
                key={expense._id}
                style={{
                  transition: 'background-color 0.2s ease',
                  ':hover': {
                    backgroundColor: 'rgba(249, 250, 251, 0.5)'
                  }
                }}
              >
                <td style={{
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                  whiteSpace: 'nowrap'
                }}>
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </td>
                <td style={{
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#1f2937',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                  whiteSpace: 'nowrap'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: expense.type === 'income' ? '#10b981' : '#ef4444'
                    }}></div>
                    {expense.category}
                  </div>
                </td>
                <td style={{
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {expense.description || '-'}
                </td>
                <td style={{
                  padding: '1rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: expense.type === 'income' ? '#10b981' : '#ef4444',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                  textAlign: 'right',
                  whiteSpace: 'nowrap'
                }}>
                  {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                </td>
                <td style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                  textAlign: 'right'
                }}>
                  <button
                    onClick={() => onDelete(expense._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      color: '#ef4444',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid rgba(229, 231, 235, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(249, 250, 251, 0.7)'
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Showing {expenses.length} transactions
        </div>
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <button style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: 'white',
            color: '#6b7280',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}>
            Previous
          </button>
          <button style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: 'white',
            color: '#6b7280',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
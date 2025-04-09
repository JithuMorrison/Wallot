import React, { useState, useEffect } from 'react';

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 
  'Healthcare', 'Entertainment', 'Education', 'Shopping',
  'Other', 'Salary', 'Bonus', 'Investment', 'Gift'
];

const ExpenseForm = ({ onSubmit, type = 'expense' }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: type === 'expense' ? 'Food' : 'Salary',
    description: '',
    type: type
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: type,
      category: type === 'expense' ? 'Food' : 'Salary'
    }));
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || isNaN(formData.amount)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Reset form
      setFormData({
        amount: '',
        category: type === 'expense' ? 'Food' : 'Salary',
        description: '',
        type: type
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this to your HTML head for fonts:
  // <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(8px)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {formData.type === 'expense' ? (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#ef4444"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        ) : (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#10b981"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        Add Transaction
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Type Toggle */}
        <div style={{
          marginBottom: '1.5rem',
          background: 'rgba(243, 244, 246, 0.7)',
          borderRadius: '12px',
          padding: '0.25rem',
          display: 'inline-flex'
        }}>
          <button
            type="button"
            onClick={() => setFormData({...formData, type: 'expense', category: 'Food'})}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: formData.type === 'expense' ? 'white' : 'transparent',
              color: formData.type === 'expense' ? '#6366f1' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: formData.type === 'expense' ? '0 2px 8px rgba(99, 102, 241, 0.2)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, type: 'income', category: 'Salary'})}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: formData.type === 'income' ? 'white' : 'transparent',
              color: formData.type === 'income' ? '#10b981' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: formData.type === 'income' ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Income
          </button>
        </div>
        
        {/* Amount Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            Amount
          </label>
          <div style={{
            position: 'relative',
            borderRadius: '10px',
            boxShadow: shake ? '0 0 0 2px rgba(239, 68, 68, 0.3)' : 'none',
            transition: 'box-shadow 0.3s ease'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '1rem',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              $
            </div>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.5rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                background: 'rgba(249, 250, 251, 0.7)',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '500'
              }}
              placeholder="0.00"
            />
          </div>
        </div>
        
        {/* Category Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            Category
          </label>
          <div style={{
            position: 'relative',
            borderRadius: '10px'
          }}>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                background: 'rgba(249, 250, 251, 0.7)',
                fontSize: '1rem',
                appearance: 'none',
                transition: 'all 0.2s ease',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {categories
                .filter(cat => 
                  formData.type === 'expense' 
                    ? !['Salary', 'Bonus', 'Investment', 'Gift'].includes(cat)
                    : ['Salary', 'Bonus', 'Investment', 'Gift'].includes(cat)
                )
                .map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
            </select>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '1rem',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#6b7280">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Description Field */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              background: 'rgba(249, 250, 251, 0.7)',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '500',
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder="Add any additional details..."
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '10px',
            border: 'none',
            background: formData.type === 'expense' 
              ? 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)'
              : 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
            color: 'white',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          }}
        >
          {isSubmitting ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Processing...
            </div>
          ) : (
            `Add ${formData.type === 'expense' ? 'Expense' : 'Income'}`
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExpenseForm;
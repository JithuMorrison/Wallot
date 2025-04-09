import React, { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 
  'Healthcare', 'Entertainment', 'Education', 'Shopping',
  'Other'
];

const periods = ['weekly', 'monthly', 'yearly'];

const BudgetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: categories[0],
    limit: '',
    period: 'monthly'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.limit || isNaN(formData.limit)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        limit: parseFloat(formData.limit)
      });
      
      // Reset form
      setFormData({
        category: categories[0],
        limit: '',
        period: 'monthly'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M17 9V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4v-2m1-3h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1z" 
            />
          </svg>
          Add New Budget
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Category Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full pl-4 pr-10 py-3 text-base border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg appearance-none bg-gray-50 transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Limit Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spending Limit
          </label>
          <motion.div
            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="relative rounded-lg"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all"
              placeholder="0.00"
            />
          </motion.div>
        </div>
        
        {/* Period Field */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Period
          </label>
          <div className="grid grid-cols-3 gap-3">
            {periods.map(period => (
              <motion.div 
                key={period}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <input
                  type="radio"
                  id={period}
                  name="period"
                  value={period}
                  checked={formData.period === period}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <label 
                  htmlFor={period}
                  className={`block p-3 text-center border rounded-lg cursor-pointer transition-all ${
                    formData.period === period 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </label>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
            isSubmitting 
              ? 'bg-indigo-400' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Create Budget'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default BudgetForm;
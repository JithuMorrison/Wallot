import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';

const Budgets = ({ user }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await axios.get('/budgets');
        setBudgets(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch budgets');
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleAddBudget = async (budgetData) => {
    try {
      const res = await axios.post('/budgets', budgetData);
      setBudgets([...budgets, res.data]);
    } catch (err) {
      setError('Failed to add budget');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/budgets/${id}`);
      setBudgets(budgets.filter(budget => budget._id !== id));
    } catch (err) {
      setError('Failed to delete budget');
    }
  };

  if (loading) return <div>Loading budgets...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Budgets</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BudgetForm onSubmit={handleAddBudget} />
        </div>
        
        <div className="md:col-span-2">
          <BudgetList budgets={budgets} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default Budgets;
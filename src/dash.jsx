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
        
        // Check for budget alerts
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
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const chartData = {
    labels: summary.recentExpenses.map(exp => exp.category),
    datasets: [
      {
        label: 'Recent Expenses',
        data: summary.recentExpenses.map(exp => exp.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.username}</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">${summary.totalIncome.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Balance</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            ${(summary.totalIncome - summary.totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
            <Link to="/expenses" className="text-sm text-indigo-600 hover:text-indigo-500">
              View All
            </Link>
          </div>
          {summary.recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {summary.recentExpenses.map((expense) => (
                <div key={expense._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{expense.category}</p>
                    <p className="text-sm text-gray-500">{expense.description || 'No description'}</p>
                  </div>
                  <p className="text-red-600 font-medium">-${expense.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent expenses</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Distribution</h3>
          {summary.recentExpenses.length > 0 ? (
            <div className="h-64">
              <Doughnut data={chartData} />
            </div>
          ) : (
            <p className="text-gray-500">No data to display</p>
          )}
        </div>
      </div>
      
      {summary.budgetAlerts.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Alerts</h3>
          <div className="space-y-3">
            {summary.budgetAlerts.map((alert, index) => (
              <div key={index} className="bg-red-50 p-3 rounded-md">
                <p className="font-medium text-red-800">
                  You've exceeded your {alert.category} budget by ${alert.over.toFixed(2)}
                </p>
                <p className="text-sm text-red-600">
                  Spent: ${alert.spent.toFixed(2)} | Limit: ${alert.limit.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = ({ user }) => {
  const [reportType, setReportType] = useState('monthly');
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (reportType === 'monthly') {
          const res = await axios.get(`/reports/monthly?year=${dateFilter.year}&month=${dateFilter.month}`);
          setMonthlyData(res.data);
        } else {
          const res = await axios.get(`/reports/yearly?year=${dateFilter.year}`);
          setYearlyData(res.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch report data');
        setLoading(false);
      }
    };

    fetchData();
  }, [reportType, dateFilter]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  if (loading) return <div>Loading report...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Financial Reports</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          {reportType === 'monthly' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <select
                  name="year"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={dateFilter.year}
                  onChange={handleDateChange}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Month</label>
                <select
                  name="month"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={dateFilter.month}
                  onChange={handleDateChange}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={dateFilter.year}
                onChange={handleDateChange}
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {reportType === 'monthly' && monthlyData ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ${monthlyData.totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${monthlyData.expenses.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Savings</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(monthlyData.totalIncome - monthlyData.expenses.reduce((sum, item) => sum + item.total, 0)).toFixed(2)}
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Expenses by Category</h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: monthlyData.expenses.map(item => item._id),
                  datasets: [
                    {
                      label: 'Amount Spent',
                      data: monthlyData.expenses.map(item => item.total),
                      backgroundColor: 'rgba(79, 70, 229, 0.5)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {monthlyData.budgetAlerts.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Budget Alerts</h2>
              <div className="space-y-3">
                {monthlyData.budgetAlerts.map((alert, index) => (
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
      ) : yearlyData ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Yearly Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ${yearlyData.totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${yearlyData.totalExpense.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Savings</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${yearlyData.savings.toFixed(2)}
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Monthly Trends</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: Array.from({ length: 12 }, (_, i) => 
                    new Date(0, i).toLocaleString('default', { month: 'short' })
                  ),
                  datasets: [
                    {
                      label: 'Income',
                      data: Array.from({ length: 12 }, (_, i) => {
                        const monthData = yearlyData.monthlyIncomes.find(item => item._id === i + 1);
                        return monthData ? monthData.total : 0;
                      }),
                      borderColor: 'rgb(34, 197, 94)',
                      backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    },
                    {
                      label: 'Expenses',
                      data: Array.from({ length: 12 }, (_, i) => {
                        const monthData = yearlyData.monthlyExpenses.find(item => item._id === i + 1);
                        return monthData ? monthData.total : 0;
                      }),
                      borderColor: 'rgb(239, 68, 68)',
                      backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-3">Expenses by Category</h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: yearlyData.categoryExpenses.map(item => item._id),
                  datasets: [
                    {
                      label: 'Amount Spent',
                      data: yearlyData.categoryExpenses.map(item => item.total),
                      backgroundColor: 'rgba(79, 70, 229, 0.5)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Reports;
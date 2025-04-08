import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">Finance Tracker</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="py-4 px-2 text-gray-500 font-semibold hover:text-indigo-500 transition duration-300">
              Dashboard
            </Link>
            <Link to="/expenses" className="py-4 px-2 text-gray-500 font-semibold hover:text-indigo-500 transition duration-300">
              Expenses
            </Link>
            <Link to="/budgets" className="py-4 px-2 text-gray-500 font-semibold hover:text-indigo-500 transition duration-300">
              Budgets
            </Link>
            <Link to="/reports" className="py-4 px-2 text-gray-500 font-semibold hover:text-indigo-500 transition duration-300">
              Reports
            </Link>
            <button 
              onClick={handleLogout}
              className="py-2 px-2 text-gray-500 font-semibold hover:text-indigo-500 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
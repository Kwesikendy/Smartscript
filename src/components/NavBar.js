import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavBar(){
  const { logout } = useContext(AuthContext);
  return (
    <nav className="bg-white shadow p-4 flex gap-6 items-center border-b border-gray-100">
      <Link to="/dashboard" className="font-bold text-indigo-600 text-lg">Smartscript</Link>
      <div className="flex gap-4 items-center text-sm text-gray-600">
        <Link to="/upload-scheme" className="hover:text-indigo-600 transition">Upload Scheme</Link>
        <Link to="/upload-script" className="hover:text-indigo-600 transition">Upload Script</Link>
        <Link to="/results" className="hover:text-indigo-600 transition">Results</Link>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button onClick={() => window.location.href = '/dashboard'} className="px-3 py-1 text-sm rounded bg-yellow-500 text-white">Dashboard</button>
        <button onClick={logout} className="text-sm px-3 py-1 bg-red-500 text-white rounded">Logout</button>
      </div>
    </nav>
  );
}

import React from 'react';
import './App.css';
import Login from './pages/Login';
import dotenv from 'dotenv';
dotenv.config();



// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


function App() {
  return (
    <Login />
  );
}

export default App;

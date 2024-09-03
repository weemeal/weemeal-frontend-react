import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';
import Navbar from './components/Navbar';

  const App: React.FC = () => {
    return (
        <Router>
      <Navbar /> {/* Navbar hinzufügen */}
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/new" element={<RecipeForm />} />
            <Route path="/edit/:id" element={<RecipeForm />} />
          </Routes>
        </Router>
    );
  };

  export default App;





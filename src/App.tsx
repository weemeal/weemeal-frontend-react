import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './components/recipe/list/RecipeList';
import RecipeDetail from './components/recipe/detail/RecipeDetail';
import RecipeForm from './components/recipe/form/RecipeForm';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';  // Footer importieren

  const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
      <Navbar /> {/* Navbar hinzufügen */}
                <div className="main-content">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/new" element={<RecipeForm />} />
            <Route path="/edit/:id" element={<RecipeForm />} />
          </Routes>
                </div>
                <Footer /> {/* Footer hinzufügen */}
            </div>
        </Router>
    );
  };

  export default App;

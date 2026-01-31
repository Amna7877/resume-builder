import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Templates from './pages/Templates'; 
import PreviewTemplate from './pages/PreviewTemplate';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';


function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/signup" element={<Signup darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/templates" element={<Templates darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/templates/:id" element={<PreviewTemplate darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/create-resume" element={<CreateResume darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />

      </Routes>
    </Router>
  );
}

export default App;
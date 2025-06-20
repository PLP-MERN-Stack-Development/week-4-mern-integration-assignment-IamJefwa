import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ChatApp from './pages/Chatpage.js';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;

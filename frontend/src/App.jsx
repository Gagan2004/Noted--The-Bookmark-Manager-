import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notes from './pages/Notes';
import Bookmarks from './pages/Bookmarks';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg text-white">
        <Navbar />
        <Routes>
          <Route path="/notes" element={<Notes />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

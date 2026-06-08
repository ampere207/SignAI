import './App.css'
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Convert from './Pages/Convert';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

function App() {
  return(
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path='/' element={<Convert />} />
            <Route path='*' element={<Convert />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmittedCases from './SubmittedCases';
import Login from './Login';
import CaseForm from './CaseForm';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !currentUser
              ? <Login onLogin={setCurrentUser} />
              : <CaseForm user={currentUser} onLogout={() => setCurrentUser(null)} />
          }
        />
        <Route path="/cases" element={<SubmittedCases />} />
      </Routes>
    </Router>
  );
}

export default App;

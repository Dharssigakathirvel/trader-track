import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import AddCompany from './pages/AddCompany.jsx';
import EditCompany from './pages/EditCompany.jsx';
import CompanyDetail from './pages/CompanyDetail.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                  element={<Dashboard />} />
        <Route path="/company/new"       element={<AddCompany />} />
        <Route path="/company/:id/edit"  element={<EditCompany />} />
        <Route path="/company/:id"       element={<CompanyDetail />} />
        <Route path="*"                  element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
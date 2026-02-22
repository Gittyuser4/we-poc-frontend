import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './shared/components/Navbar';
import Admin from './UI/Auth/Admin';
import SurveyForm from './UI/PreAuth/SurveyForm';
import Login from './UI/PreAuth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { FormProvider } from './context/FormContext';
import { LanguageProvider } from './context/LanguageContext';
import CreatePassword from './UI/Auth/CreatePassword';

function App() {
  return (
    <LanguageProvider>
      <FormProvider>
        <Router>
          <div className="app-container">
            <AppNavbar />
            <div className="app-content">
              <Routes>
                <Route path="/" element={<SurveyForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create-password" element={<CreatePassword />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </FormProvider>
    </LanguageProvider>
  );
}

export default App;

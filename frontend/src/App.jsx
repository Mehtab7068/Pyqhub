import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './app/store';
import { getCurrentUser } from './app/slices/authSlice';
import ExamPage from './pages/ExamPage';
import AdminUpload from './pages/AdminUpload';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import About from './pages/About';
import HowToUse from './pages/HowToUse';
import Contact from './pages/Contact';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import AnimatedBackground from './components/AnimatedBackground';

const App = () => {
    const { token } = store.getState().auth;

    useEffect(() => {
        if (token) {
            store.dispatch(getCurrentUser());
        }
    }, [token]);

    return (
        <Provider store={store}>
            <Router>
                <div className="relative min-h-screen">
                    <AnimatedBackground />
                    <div className="relative z-10">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <ExamPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/exam"
                                element={
                                    <ProtectedRoute>
                                        <ExamPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <AdminUpload />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/about" element={<About />} />
                            <Route path="/how-to-use" element={<HowToUse />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route
                                path="/account"
                                element={
                                    <ProtectedRoute>
                                        <Account />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/account/edit"
                                element={
                                    <ProtectedRoute>
                                        <EditProfile />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </Router>
        </Provider>
    );
};

export default App;
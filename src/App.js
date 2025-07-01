import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import SubServices from './Pages/SubServices';
import Services from './Pages/Services';
import Gallery from './Pages/Gallery';
import Testimonials from './Pages/Testimonials';
import AdminLogin from './Pages/AdminLogin';
import { ConfigProvider } from "antd";
import { useAuth } from './contexts/authContext';

const ProtectedRoute = ({ children }) => {
    const { user, token } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function App() {

    return (
        <Router>
            <Routes>
                {/* Public route for login */}
                <Route path="/" element={<AdminLogin />} />

                {/* Protected routes - only accessible if authenticated */}
                <Route
                    path="/"
                >
                    {/* Main Layout for all authenticated routes */}
                    <Route
                        element={
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: "#74ECDC",
                                        colorBgMenuItemSelected: "#74ECDC",
                                        colorBgMenuItemHover: "#7F89F0",
                                    },
                                }}
                            >
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            </ConfigProvider>
                        }>
                        <Route path="Services" element={<Services />} />
                        <Route path="SubServices" element={<SubServices />} />
                        <Route path="Gallery" element={<Gallery />} />
                        <Route path="Testimonials" element={<Testimonials />} />
                    </Route>
                </Route>

                {/* Catch-all for non-existing routes */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;

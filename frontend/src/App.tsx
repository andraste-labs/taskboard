import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BoardPage } from './pages/BoardPage';
import { ToastRegion } from './components/ToastRegion';
import { ToastProvider } from './context/ToastContext';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="*" element={<BoardPage />} />
        </Routes>
        <ToastRegion />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
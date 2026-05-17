import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx';
import { DarkModeProvider } from './context/DarkModeContext.jsx';
import BoardPage from './pages/BoardPage.jsx';
import FeedbackDetailPage from './pages/FeedbackDetailPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AdminProvider>
          <FilterProvider>
            <Routes>
              <Route path="/" element={<BoardPage />} />
              <Route path="/feedback/:id" element={<FeedbackDetailPage />} />
            </Routes>
          </FilterProvider>
        </AdminProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
}

import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import InvitePage from './pages/InvitePage';

const AdminPage = lazy(() => import('./pages/AdminPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvitePage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="admin-loading">Đang tải...</div>}>
              <AdminPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

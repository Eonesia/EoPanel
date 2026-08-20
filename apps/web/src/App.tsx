import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./lib/auth";
import { NotificationsProvider } from "./lib/notifications";
import { LoginPage } from "./pages/LoginPage";
import { PanelPage } from "./pages/PanelPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/panel/:tabId"
              element={
                <RequireAuth>
                  <PanelPage />
                </RequireAuth>
              }
            />
            <Route
              path="/panel/:tabId/:sectorId"
              element={
                <RequireAuth>
                  <PanelPage />
                </RequireAuth>
              }
            />
            <Route
              path="/panel/:tabId/:sectorId/:tagId"
              element={
                <RequireAuth>
                  <PanelPage />
                </RequireAuth>
              }
            />
            <Route path="/" element={<Navigate to="/panel/global" replace />} />
            <Route path="*" element={<Navigate to="/panel/global" replace />} />
          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

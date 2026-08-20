import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./lib/auth";
import { NotificationsProvider } from "./lib/notifications";
import { PermissionsProvider } from "./lib/permissions";
import { ToastProvider } from "./lib/toast";
import { LoginPage } from "./pages/LoginPage";
import { PanelPage } from "./pages/PanelPage";
import { PermissionsAdminPage } from "./pages/PermissionsAdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <PermissionsProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/panel/admin/permisos"
                  element={
                    <RequireAuth>
                      <PermissionsAdminPage />
                    </RequireAuth>
                  }
                />
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
            </ToastProvider>
          </PermissionsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

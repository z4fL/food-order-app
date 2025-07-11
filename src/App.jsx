import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";

import { CartProvider } from "./context/CartProvider";
import Home from "./components/Home";
import Cart from "./components/Cart";
import DetailOrder from "./components/DetailOrder";
import ScrollToTop from "./utilities/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/admin/Login";
import Menu from "./components/Menu";
import DetailDashboard from "./components/admin/DetailDashboard";
import Kasir from "./components/kasir/Kasir";

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !JSON.parse(sessionStorage.getItem("splashShown"))
  );

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("splashShown", JSON.stringify(true));
    }, 2000);
  }, []);

  // ProtectedRoute component to guard admin routes
  const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem("access_token");
    return accessToken ? children : <Login />;
  };

  return showSplash ? (
    <SplashScreen />
  ) : (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route index element={<Home />} />
        <Route path="menu/:nomorMeja" element={<Menu />} />
        <Route path="cart/:nomorMeja" element={<Cart />} />
        <Route path="detail-order/:uuid" element={<DetailOrder />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/:uuid"
          element={
            <ProtectedRoute>
              <DetailDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="cashier"
          element={
            <ProtectedRoute>
              <Kasir />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
      </Routes>
    </CartProvider>
  );
}

export default App;

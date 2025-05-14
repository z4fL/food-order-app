import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";

import { CartProvider } from "./context/CartProvider";
import Home from "./components/Home";
import Cart from "./components/Cart";
import DetailOrder from "./components/DetailOrder";
import ScrollToTop from "./utilities/ScrollToTop";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("splashShown");
    if (!hasShown) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    }
  }, []);

  if (showSplash) return <SplashScreen />

  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="detail-order" element={<DetailOrder />} />
      </Routes>
    </CartProvider>
  );
}

export default App;

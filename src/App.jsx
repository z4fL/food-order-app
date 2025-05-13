import { Route, Routes } from "react-router";
import Home from "./components/Home";
import Cart from "./components/Cart";
import DetailOrder from "./components/DetailOrder";
import { CartProvider } from "./context/CartProvider";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="detail-order" element={<DetailOrder />} />
      </Routes>
    </CartProvider>
  );
}

export default App;

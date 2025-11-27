// src/App.jsx
import { CartProvider } from "./CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Your routes */}
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* We'll add more routes later */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

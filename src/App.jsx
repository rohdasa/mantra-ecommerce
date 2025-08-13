import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          {/* Add more routes as you build them */}
          <Route path="/cart" element={<div>Cart Page (Coming Soon)</div>} />
          <Route
            path="/wishlist"
            element={<div>Wishlist Page (Coming Soon)</div>}
          />
          <Route
            path="/profile"
            element={<div>Profile Page (Coming Soon)</div>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

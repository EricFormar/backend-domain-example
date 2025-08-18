import { useEffect, useState } from "react";
import "./App.css";
import { listProducts } from "@application/use-cases/product/list-products";
import { HttpProductRepository } from "@infrastructure/repositories/http-product-repository";
import { Product } from "@domain";
import { ProductCard } from "./components";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const repository = new HttpProductRepository();
    const fetchProducts = async () => {
      const result = await listProducts(repository);
      setProducts(result);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container products-wrapper">
      <div className="row">
        <div className="col-12">
          <h2 className="products-title">Todos los productos</h2>
        </div>
        <div className="container products-wrapper">
          <div className="row">
            {products.map((product) => (
              <ProductCard key={product.id} product={product}></ProductCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

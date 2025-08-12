import { useEffect, useState } from 'react'
import './App.css'
import { listProducts } from '@application/use-cases/product/list-products';
import { HttpProductRepository } from '@infrastructure/repositories/http-product-repository';
import { Product } from '@domain';
import { ProductCard } from './components';

function App() {
  
  const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  const repository = new HttpProductRepository
  const fetchProducts = async () => {
    const result = await listProducts(repository);
    console.log(result);
    
    setProducts(result)
  }
  fetchProducts()
}, [])

  return (
    <>
    <img src="./src/assets/react.svg" alt="" />
    {products.map((product) => (
      <ProductCard key={product.id} product={product}></ProductCard>
    ))}
    </>
  )
}

export default App


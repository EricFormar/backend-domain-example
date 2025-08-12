import type { Product } from '@domain'

export type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }} />
      <h3 style={{ marginTop: 8 }}>{product.name}</h3>
      <p style={{ color: '#666', fontSize: 14 }}>{product.description}</p>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <strong>${product.price.toFixed(2)}</strong>
        {product.discount > 0 && (
          <span style={{ color: 'tomato', fontSize: 12 }}>-{product.discount}%</span>
        )}
      </div>
    </article>
  )
}

export default ProductCard
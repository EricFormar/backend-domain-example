import type { Product } from "@domain";

export type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <section className="product-box">
        <a href="#">
          <figure className="product-box_image">
            <img width="80%" src={product.image} alt="imagen de producto" />
          </figure>
          <article className="product-box_data">
            <h2>{product.price}</h2>
            {product.discount > 0 && <span>{product.discount}% OFF</span>}
            <p>{product.name}</p>
            <i className="fas fa-truck"></i>
          </article>
        </a>
      </section>
    </div>
  );
}

export default ProductCard;

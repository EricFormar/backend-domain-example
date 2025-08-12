import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from './ProductCard'
import type { Product } from '@domain'

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard
}
export default meta

type Story = StoryObj<typeof ProductCard>

const sampleProduct: Product = {
  id: 'p1',
  name: 'Wireless Headphones',
  description: 'Noise-cancelling over-ear headphones with 30h battery life',
  image: 'https://picsum.photos/seed/headphones/400/300',
  price: 129.99,
  discount: 10
}

export const Default: Story = {
  args: {
    product: sampleProduct
  }
}
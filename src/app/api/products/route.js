// GET /api/products  -> list active products
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data/products';

export async function GET() {
  const products = await getProducts();
  // Strip heavy fields not needed for the grid.
  const list = products.map(({ specs, details, ...rest }) => rest);
  return NextResponse.json({ products: list });
}

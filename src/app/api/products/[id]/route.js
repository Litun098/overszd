// GET /api/products/[id]  -> single product
import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/data/products';

export async function GET(_req, ctx) {
  const { id } = await ctx.params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ product });
}

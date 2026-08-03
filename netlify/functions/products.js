import { prisma } from './_lib/prisma.js';
import {
  getAuthenticatedUser,
  requireAdmin,
  jsonResponse,
  handleAuthError,
} from './_lib/auth.js';
import { snakeCaseKeys } from './_lib/serialize.js';

// Reachable at /api/products and /api/products/:id via the netlify.toml
// "/api/*" -> "/.netlify/functions/:splat" redirect.
function getIdFromPath(event) {
  const path = event.path || '';
  const marker = '/products';
  const idx = path.indexOf(marker);
  const rest = idx === -1 ? '' : path.slice(idx + marker.length);
  const [id] = rest.split('/').filter(Boolean);
  return id || null;
}

function serializeBrand(brand) {
  return snakeCaseKeys({
    ...brand,
    price: brand.price?.toString() ?? null,
    timesBought: brand.timesBought?.toString() ?? null,
  });
}

export async function handler(event) {
  try {
    const id = getIdFromPath(event);
    const query = event.queryStringParameters || {};

    if (event.httpMethod === 'GET') {
      if (id) {
        const brand = await prisma.brand.findUnique({ where: { id: Number(id) } });
        if (!brand) {
          return jsonResponse(404, { success: false, error: 'Product not found' });
        }
        return jsonResponse(200, { success: true, data: serializeBrand(brand) });
      }

      if (query.bestsellers === '1') {
        const limit = Number(query.limit) || 12;
        const brands = await prisma.brand.findMany({
          where: { timesBought: { gt: 0 } },
          orderBy: { timesBought: 'desc' },
          take: limit,
        });
        return jsonResponse(200, { success: true, data: brands.map(serializeBrand) });
      }

      if (query.latest === '1') {
        const limit = Number(query.limit) || 12;
        const brands = await prisma.brand.findMany({
          orderBy: { id: 'desc' },
          take: limit,
        });
        return jsonResponse(200, { success: true, data: brands.map(serializeBrand) });
      }

      const brands = await prisma.brand.findMany({ orderBy: { brand: 'asc' } });
      return jsonResponse(200, { success: true, data: brands.map(serializeBrand) });
    }

    // Every write below is super-admin only, mirroring the RLS-enforced
    // admin-only writes on `brands` under Supabase.
    const { role } = await getAuthenticatedUser(event);
    requireAdmin({ role });

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const brand = await prisma.brand.create({ data: body });
      return jsonResponse(201, {
        success: true,
        data: serializeBrand(brand),
        message: 'Product created successfully',
      });
    }

    if (event.httpMethod === 'PATCH') {
      if (!id) {
        return jsonResponse(400, { success: false, error: 'Missing product id' });
      }
      const body = JSON.parse(event.body || '{}');
      const brand = await prisma.brand.update({ where: { id: Number(id) }, data: body });
      return jsonResponse(200, {
        success: true,
        data: serializeBrand(brand),
        message: 'Product updated successfully',
      });
    }

    if (event.httpMethod === 'DELETE') {
      if (!id) {
        return jsonResponse(400, { success: false, error: 'Missing product id' });
      }
      await prisma.brand.delete({ where: { id: Number(id) } });
      return jsonResponse(200, { success: true, message: 'Product deleted successfully' });
    }

    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  } catch (error) {
    return handleAuthError(error);
  }
}

import { Prisma } from '@prisma/client';
import { prisma } from './_lib/prisma.js';
import { getAuthenticatedUser, jsonResponse, handleAuthError, AuthError } from './_lib/auth.js';

function getPathSegments(event) {
  const path = event.path || '';
  const marker = '/wishlist';
  const idx = path.indexOf(marker);
  const rest = idx === -1 ? '' : path.slice(idx + marker.length);
  return rest.split('/').filter(Boolean);
}

function serializeWishlistItem(item) {
  return {
    ...item,
    productPrice: item.productPrice?.toString() ?? null,
  };
}

export async function handler(event) {
  try {
    const { userId } = await getAuthenticatedUser(event);
    const [segment] = getPathSegments(event);
    const query = event.queryStringParameters || {};

    if (event.httpMethod === 'GET') {
      if (segment === 'check') {
        const productId = String(query.productId);
        const item = await prisma.wishlistItem.findUnique({
          where: { userId_productId: { userId, productId } },
        });
        return jsonResponse(200, {
          success: true,
          isInWishlist: !!item,
          data: item ? serializeWishlistItem(item) : null,
        });
      }

      const items = await prisma.wishlistItem.findMany({
        where: { userId },
        orderBy: { addedAt: 'desc' },
      });
      return jsonResponse(200, { success: true, data: items.map(serializeWishlistItem) });
    }

    if (event.httpMethod === 'POST') {
      const { productId, productData } = JSON.parse(event.body || '{}');

      try {
        const created = await prisma.wishlistItem.create({
          data: {
            userId,
            productId: String(productId),
            productName: productData.name || productData.model,
            productPrice: productData.price,
            productImageUrl: productData.image_url,
          },
        });
        return jsonResponse(201, {
          success: true,
          data: serializeWishlistItem(created),
          message: 'Added to wishlist successfully',
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return jsonResponse(200, {
            success: false,
            message: 'Item is already in your wishlist',
          });
        }
        throw error;
      }
    }

    if (event.httpMethod === 'DELETE') {
      if (segment) {
        const item = await prisma.wishlistItem.findUnique({ where: { id: segment } });
        if (!item || item.userId !== userId) {
          throw new AuthError('Wishlist item not found', 404);
        }
        await prisma.wishlistItem.delete({ where: { id: segment } });
        return jsonResponse(200, { success: true, message: 'Removed from wishlist successfully' });
      }

      if (query.productId) {
        await prisma.wishlistItem.deleteMany({
          where: { userId, productId: String(query.productId) },
        });
        return jsonResponse(200, { success: true, message: 'Removed from wishlist successfully' });
      }

      return jsonResponse(400, { success: false, error: 'Missing wishlist item id or productId' });
    }

    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  } catch (error) {
    return handleAuthError(error);
  }
}

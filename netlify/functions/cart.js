import { prisma } from './_lib/prisma.js';
import { getAuthenticatedUser, jsonResponse, handleAuthError, AuthError } from './_lib/auth.js';

function getIdFromPath(event) {
  const path = event.path || '';
  const marker = '/cart';
  const idx = path.indexOf(marker);
  const rest = idx === -1 ? '' : path.slice(idx + marker.length);
  const [id] = rest.split('/').filter(Boolean);
  return id || null;
}

function serializeCartItem(item) {
  return { ...item, price: item.price.toString() };
}

async function assertOwnsCartItem(cartItemId, userId) {
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.userId !== userId) {
    throw new AuthError('Cart item not found', 404);
  }
  return item;
}

export async function handler(event) {
  try {
    const { userId } = await getAuthenticatedUser(event);
    const id = getIdFromPath(event);

    if (event.httpMethod === 'GET') {
      const items = await prisma.cartItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return jsonResponse(200, { success: true, data: items.map(serializeCartItem) });
    }

    if (event.httpMethod === 'POST') {
      const watchData = JSON.parse(event.body || '{}');
      const watchId = Number(watchData.id);

      const existing = await prisma.cartItem.findFirst({
        where: { userId, watchId },
      });

      if (existing) {
        const updated = await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + 1 },
        });
        return jsonResponse(200, { success: true, data: serializeCartItem(updated) });
      }

      const created = await prisma.cartItem.create({
        data: {
          userId,
          watchId,
          model: watchData.model,
          brand: watchData.brand,
          price: watchData.price,
          image: watchData.image,
          quantity: 1,
        },
      });
      return jsonResponse(201, { success: true, data: serializeCartItem(created) });
    }

    if (event.httpMethod === 'PATCH') {
      if (!id) {
        return jsonResponse(400, { success: false, error: 'Missing cart item id' });
      }
      const { quantity } = JSON.parse(event.body || '{}');

      if (!Number.isInteger(quantity) || quantity > 99) {
        return jsonResponse(400, { success: false, error: 'Invalid quantity' });
      }

      await assertOwnsCartItem(id, userId);

      if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id } });
        return jsonResponse(200, { success: true });
      }

      const updated = await prisma.cartItem.update({ where: { id }, data: { quantity } });
      return jsonResponse(200, { success: true, data: serializeCartItem(updated) });
    }

    if (event.httpMethod === 'DELETE') {
      if (id) {
        await assertOwnsCartItem(id, userId);
        await prisma.cartItem.delete({ where: { id } });
        return jsonResponse(200, { success: true });
      }

      // No id -> clear the whole cart for the authenticated user.
      await prisma.cartItem.deleteMany({ where: { userId } });
      return jsonResponse(200, { success: true });
    }

    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  } catch (error) {
    return handleAuthError(error);
  }
}

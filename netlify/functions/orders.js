import { prisma } from './_lib/prisma.js';
import { getAuthenticatedUser, requireAdmin, jsonResponse, handleAuthError, AuthError } from './_lib/auth.js';
import { snakeCaseKeys } from './_lib/serialize.js';

function getPathSegments(event) {
  const path = event.path || '';
  const marker = '/orders';
  const idx = path.indexOf(marker);
  const rest = idx === -1 ? '' : path.slice(idx + marker.length);
  return rest.split('/').filter(Boolean);
}

function serializeOrder(order) {
  // `items` is an opaque JSON blob with its own camelCase convention
  // (productId, imageUrl, ...) set by this file on order creation -- not
  // derived from column names, so it must NOT go through snakeCaseKeys.
  return snakeCaseKeys({ ...order, totalAmount: order.totalAmount.toString() });
}

function computeStats(orders) {
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    processingOrders: orders.filter((o) => o.status === 'processing').length,
    shippedOrders: orders.filter((o) => o.status === 'shipped').length,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
    cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
    totalSpent: orders
      .filter((o) => !['cancelled', 'refunded'].includes(o.status))
      .reduce((sum, o) => sum + Number(o.totalAmount), 0),
  };
}

export async function handler(event) {
  try {
    const { userId, role } = await getAuthenticatedUser(event);
    const [first, second] = getPathSegments(event);
    const query = event.queryStringParameters || {};

    if (event.httpMethod === 'GET') {
      if (first === 'stats') {
        const orders = await prisma.order.findMany({ where: { userId } });
        return jsonResponse(200, { success: true, data: computeStats(orders) });
      }

      if (query.all === '1') {
        requireAdmin({ role });
        const orders = await prisma.order.findMany({ orderBy: { orderDate: 'desc' } });
        return jsonResponse(200, { success: true, data: orders.map(serializeOrder) });
      }

      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { orderDate: 'desc' },
      });
      return jsonResponse(200, { success: true, data: orders.map(serializeOrder) });
    }

    if (event.httpMethod === 'POST') {
      const { items, shippingInfo, paymentMethod, shippingType } = JSON.parse(event.body || '{}');

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemsJson = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        model: item.model,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
      }));

      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            userId,
            totalAmount,
            status: 'pending',
            items: itemsJson,
            shippingAddress: shippingInfo?.address,
            shippingCity: shippingInfo?.city,
            shippingPostalCode: shippingInfo?.postalCode,
            shippingCountry: shippingInfo?.country,
            shippingPhone: shippingInfo?.phone,
            paymentMethod,
            shippingType,
          },
        });

        for (const item of items) {
          if (item.productId) {
            // Explicit ::bigint cast -- increment_times_bought's product_id
            // param is bigint (brands.id is bigint), and item.productId
            // arrives here as a plain JS number from the client.
            await tx.$executeRaw`SELECT increment_times_bought(${item.productId}::bigint, ${item.quantity})`;
          }
        }

        return created;
      });

      return jsonResponse(201, {
        success: true,
        data: serializeOrder(order),
        message: 'Order created successfully',
      });
    }

    if (event.httpMethod === 'PATCH') {
      if (!first) {
        return jsonResponse(400, { success: false, error: 'Missing order id' });
      }

      if (second === 'status') {
        requireAdmin({ role });
        const { status } = JSON.parse(event.body || '{}');
        const updateData = { status };
        if (status === 'shipped') updateData.shippedAt = new Date();
        if (status === 'delivered') updateData.deliveredAt = new Date();

        const order = await prisma.order.update({ where: { id: first }, data: updateData });
        return jsonResponse(200, {
          success: true,
          data: serializeOrder(order),
          message: 'Order status updated successfully',
        });
      }

      if (second === 'shipping') {
        const existing = await prisma.order.findUnique({ where: { id: first } });
        if (!existing || existing.userId !== userId) {
          throw new AuthError('Order not found', 404);
        }
        if (existing.status !== 'pending') {
          return jsonResponse(400, {
            success: false,
            message: 'Shipping address can only be updated for pending orders',
          });
        }

        const shippingInfo = JSON.parse(event.body || '{}');
        const order = await prisma.order.update({
          where: { id: first },
          data: {
            shippingAddress: shippingInfo.address,
            shippingCity: shippingInfo.city,
            shippingPostalCode: shippingInfo.postalCode,
            shippingCountry: shippingInfo.country,
            shippingPhone: shippingInfo.phone,
          },
        });
        return jsonResponse(200, {
          success: true,
          data: serializeOrder(order),
          message: 'Shipping address updated successfully',
        });
      }

      return jsonResponse(404, { success: false, error: 'Unknown order action' });
    }

    if (event.httpMethod === 'DELETE') {
      requireAdmin({ role });
      if (!first) {
        return jsonResponse(400, { success: false, error: 'Missing order id' });
      }
      await prisma.order.delete({ where: { id: first } });
      return jsonResponse(200, { success: true, message: 'Order deleted successfully' });
    }

    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  } catch (error) {
    return handleAuthError(error);
  }
}

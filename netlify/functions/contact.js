import { prisma } from './_lib/prisma.js';
import { getAuthenticatedUser, requireAdmin, jsonResponse, handleAuthError } from './_lib/auth.js';
import { snakeCaseKeys } from './_lib/serialize.js';

function getIdFromPath(event) {
  const path = event.path || '';
  const marker = '/contact';
  const idx = path.indexOf(marker);
  const rest = idx === -1 ? '' : path.slice(idx + marker.length);
  const [id] = rest.split('/').filter(Boolean);
  return id || null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateMessage({ name, email, subject, message }) {
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return 'All fields are required';
  }
  if (
    name.length > 100 ||
    email.length > 254 ||
    subject.length > 200 ||
    message.length > 5000
  ) {
    return 'One or more fields are too long';
  }
  if (!EMAIL_RE.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

export async function handler(event) {
  try {
    const id = getIdFromPath(event);

    // Submitting a message is the only public, unauthenticated write in
    // this API — validate server-side rather than trusting the client.
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const name = body.name?.trim();
      const email = body.email?.trim();
      const subject = body.subject?.trim();
      const message = body.message?.trim();

      const validationError = validateMessage({ name, email, subject, message });
      if (validationError) {
        return jsonResponse(400, { success: false, message: validationError });
      }

      const created = await prisma.contactMessage.create({
        data: { name, email, subject, message, status: 'unread' },
      });
      return jsonResponse(201, {
        success: true,
        data: snakeCaseKeys(created),
        message: 'Message sent successfully',
      });
    }

    // Everything else (listing, status updates, deletion) is admin-only.
    const { role } = await getAuthenticatedUser(event);
    requireAdmin({ role });

    if (event.httpMethod === 'GET') {
      const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return jsonResponse(200, { success: true, data: messages.map(snakeCaseKeys) });
    }

    if (event.httpMethod === 'PATCH') {
      if (!id) {
        return jsonResponse(400, { success: false, error: 'Missing message id' });
      }
      const { status } = JSON.parse(event.body || '{}');
      await prisma.contactMessage.update({ where: { id }, data: { status } });
      return jsonResponse(200, { success: true, message: 'Status updated successfully' });
    }

    if (event.httpMethod === 'DELETE') {
      if (!id) {
        return jsonResponse(400, { success: false, error: 'Missing message id' });
      }
      await prisma.contactMessage.delete({ where: { id } });
      return jsonResponse(200, { success: true, message: 'Message deleted successfully' });
    }

    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  } catch (error) {
    return handleAuthError(error);
  }
}

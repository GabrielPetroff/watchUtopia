// The frontend was written against Supabase's raw passthrough, which
// returns Postgres column names as-is (snake_case: order.total_amount,
// item.watch_id, etc). Prisma's @map() gives us camelCase field names in
// JS, so every API response's row data needs converting back to
// snake_case to avoid silently breaking every component that reads these
// fields directly -- only the {success, data, message, ...} envelope
// itself stays camelCase, never the row contents.

function toSnakeCase(key) {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Shallow by design: every row shape in this app is flat except `items`
// (an opaque JSON blob on orders, already written/read with the app's
// own camelCase convention, not derived from column names -- must not be
// touched by this).
export function snakeCaseKeys(row) {
  if (row === null || row === undefined) return row;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    result[toSnakeCase(key)] = value;
  }
  return result;
}

-- Add shipping information and payment method columns to the orders table

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Optional: Add comment to document the columns
COMMENT ON COLUMN orders.shipping_address IS 'Customer shipping street address';
COMMENT ON COLUMN orders.shipping_city IS 'Customer shipping city';
COMMENT ON COLUMN orders.shipping_postal_code IS 'Customer shipping postal/zip code';
COMMENT ON COLUMN orders.shipping_country IS 'Customer shipping country';
COMMENT ON COLUMN orders.shipping_phone IS 'Customer contact phone number';
COMMENT ON COLUMN orders.payment_method IS 'Payment method (e.g., cash_on_delivery)';

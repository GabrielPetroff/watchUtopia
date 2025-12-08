# Quick Start Guide - Wishlist & Orders Setup

This guide will help you quickly set up the wishlist and order functionality in your WatchUtopia application.

## ⚡ 5-Minute Setup

### Step 1: Run Database Migration (2 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the `supabase_schema.sql` file in your project root
5. Copy all the SQL code and paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter` (Cmd+Enter on Mac)
7. Wait for the success message

✅ You should see: "Success. No rows returned"

### Step 2: Verify Installation (1 minute)

In the same SQL Editor, run this query:

```sql
-- Check tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'wishlist_items', 'orders', 'order_items');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'wishlist_items', 'orders', 'order_items');
```

You should see 4 tables and all should have `rowsecurity = true`.

### Step 3: Create User Profile on Registration (2 minutes)

Update your registration service to create a user profile when someone signs up.

Open `src/services/auth/authServive.js` and add this code after successful registration:

```javascript
import userService from '../user/userService.js';

// In your register function, after successful signup:
async register(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create user profile in public.users table
    if (data.user) {
      await userService.createUserProfile({
        id: data.user.id,
        email: data.user.email,
        fullName: fullName
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
}
```

### Step 4: Add Navigation Links (30 seconds)

Add these links to your navigation menu (in `src/components/layout/Layout.jsx` or wherever your nav is):

```jsx
<Link to="/wishlist">Wishlist</Link>
<Link to="/orders">Orders</Link>
```

## 🧪 Test Your Setup

### Test Wishlist

1. Start your dev server: `npm run dev`
2. Log in to your account (or create one)
3. Navigate to `/wishlist`
4. You should see the wishlist page (empty if no items)

### Test Orders

1. Navigate to `/orders`
2. You should see the orders page with statistics (all zeros if no orders)

### Create Test Data

Run this in Supabase SQL Editor to create test data:

```sql
-- Get your user ID first
SELECT id, email FROM auth.users LIMIT 1;

-- Replace 'YOUR_USER_ID' with the actual UUID from above
DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- Replace this!
  v_order_id UUID;
BEGIN
  -- Create user profile if not exists
  INSERT INTO public.users (id, email, full_name)
  VALUES (v_user_id, 'test@example.com', 'Test User')
  ON CONFLICT (id) DO NOTHING;

  -- Add wishlist items
  INSERT INTO public.wishlist_items (user_id, product_id, product_name, product_price, product_brand, product_image_url)
  VALUES
    (v_user_id, 'watch-001', 'Rolex Submariner', 8500.00, 'Rolex', 'https://via.placeholder.com/300'),
    (v_user_id, 'watch-002', 'Omega Seamaster', 5200.00, 'Omega', 'https://via.placeholder.com/300'),
    (v_user_id, 'watch-003', 'Tag Heuer Carrera', 3500.00, 'Tag Heuer', 'https://via.placeholder.com/300')
  ON CONFLICT DO NOTHING;

  -- Create a test order
  INSERT INTO public.orders (
    user_id,
    order_number,
    total_amount,
    status,
    payment_method,
    shipping_address,
    shipping_city,
    shipping_postal_code,
    shipping_country
  )
  VALUES (
    v_user_id,
    'ORD-20231208-0001',
    8500.00,
    'processing',
    'credit_card',
    '123 Main Street',
    'New York',
    '10001',
    'USA'
  )
  RETURNING id INTO v_order_id;

  -- Add order items
  INSERT INTO public.order_items (
    order_id,
    product_id,
    product_name,
    product_brand,
    product_model,
    price_at_purchase,
    quantity,
    subtotal
  )
  VALUES (
    v_order_id,
    'watch-001',
    'Rolex Submariner',
    'Rolex',
    'Submariner Date',
    8500.00,
    1,
    8500.00
  );

  RAISE NOTICE 'Test data created successfully!';
END $$;
```

Now refresh your `/wishlist` and `/orders` pages - you should see the test data!

## 🎯 Usage in Your Code

### Add to Wishlist (e.g., in ProductDetailsPage.jsx)

```javascript
import wishlistService from '../services/wishlist/wishlistService.js';
import authService from '../services/auth/authServive.js';

const handleAddToWishlist = async () => {
  const user = await authService.getCurrentUser();
  if (!user) {
    navigate('/login');
    return;
  }

  const result = await wishlistService.addToWishlist(user.id, {
    productId: watch.id,
    name: watch.name,
    price: watch.price,
    imageUrl: watch.image,
    brand: watch.brand,
    model: watch.model,
  });

  if (result.success) {
    alert('Added to wishlist!');
  }
};
```

### Create Order (e.g., in CheckoutPage.jsx)

```javascript
import orderService from '../services/order/orderService.js';

const handlePlaceOrder = async () => {
  const user = await authService.getCurrentUser();

  const result = await orderService.createOrder({
    userId: user.id,
    items: cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      brand: item.brand,
      model: item.model,
      imageUrl: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    shippingInfo: {
      address: shippingForm.address,
      city: shippingForm.city,
      postalCode: shippingForm.postalCode,
      country: shippingForm.country,
      phone: shippingForm.phone,
    },
    paymentMethod: 'credit_card',
  });

  if (result.success) {
    navigate('/orders');
  }
};
```

## 📚 Available Services

All services are ready to use:

- ✅ `wishlistService` - Add, remove, check wishlist items
- ✅ `orderService` - Create, view, update, cancel orders
- ✅ `userService` - Manage user profiles and shipping addresses

## 🆘 Common Issues

### "User ID not found" or "Permission denied"

**Fix**: Make sure you created a record in `public.users` table for your auth user.

```sql
-- Run this with your actual user ID
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users WHERE email = 'your@email.com'
ON CONFLICT DO NOTHING;
```

### "Table doesn't exist"

**Fix**: Run the `supabase_schema.sql` file in SQL Editor.

### Changes not showing

**Fix**: Clear browser cache and reload, or open in incognito mode.

## ✨ You're All Set!

Your wishlist and order functionality is now fully implemented and ready to use!

### Next Steps:

1. Customize the UI colors and styling
2. Add "Add to Cart" functionality
3. Implement payment processing
4. Add email notifications for orders
5. Create an admin dashboard for order management

For detailed documentation, see `IMPLEMENTATION_GUIDE.md`.

---

**Need Help?** Check the full implementation guide or Supabase documentation.

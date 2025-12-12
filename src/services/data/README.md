# Data Service

Centralized data service for all database and storage operations in the Watch Utopia application.

## Overview

The `dataService` consolidates all data fetching, creating, updating, and deleting operations into a single, maintainable service. This improves code organization, reduces duplication, and makes it easier to manage database interactions.

## Location

`src/services/data/dataService.js`

## Features

### Product/Watch Operations

- `getAllProducts()` - Fetch all products from the brands table
- `getProductById(id)` - Fetch a single product (tries featured watches first, then brands)
- `createProduct(productData)` - Create a new product
- `updateProduct(id, updateData)` - Update an existing product
- `deleteProduct(id)` - Delete a product

### Featured Watches Operations

- `getBestSellers(limit)` - Fetch best-selling watches (sorted by price)
- `getLatestReleases(limit)` - Fetch latest watch releases (sorted by ID)

### Order Operations

- `getAllOrders()` - Fetch all orders (admin only)
- `getUserOrders(userId)` - Fetch orders for a specific user
- `getUserOrderStats(userId)` - Get order statistics for a user

### Storage/Image Operations

- `uploadImage(bucketName, file, filePath)` - Upload an image to storage
- `deleteImage(bucketName, filePath)` - Delete an image from storage
- `getImagePublicUrl(bucketName, filePath)` - Get public URL for an image
- `listStorageFiles(bucketName, path, options)` - List files in a storage bucket

### Carousel Operations

- `getCarouselImages()` - Fetch all carousel images

## Usage Examples

### Fetching Products

```javascript
import dataService from '../services/data/dataService.js';

// Fetch all products
const result = await dataService.getAllProducts();
if (result.success) {
  setProducts(result.data);
}

// Fetch single product
const result = await dataService.getProductById(productId);
if (result.success) {
  setProduct(result.data);
}
```

### Creating/Updating Products

```javascript
// Create a new product
const result = await dataService.createProduct({
  brand: 'Rolex',
  model: 'Submariner',
  price: 8500,
  image: 'path/to/image.jpg',
  tag: 'Luxury',
  description: 'Classic diving watch',
});

// Update a product
const result = await dataService.updateProduct(productId, {
  price: 9000,
  description: 'Updated description',
});
```

### Image Operations

```javascript
// Upload an image
const result = await dataService.uploadImage(
  'watch-images',
  imageFile,
  'products/my-watch.jpg'
);
if (result.success) {
  const imageUrl = result.data.publicUrl;
}

// Delete an image
await dataService.deleteImage('watch-images', 'products/old-watch.jpg');
```

### Order Operations

```javascript
// Get user orders
const result = await dataService.getUserOrders(userId);
if (result.success) {
  setOrders(result.data);
}

// Get user statistics
const result = await dataService.getUserOrderStats(userId);
if (result.success) {
  setStats(result.data);
}
```

## Response Format

All methods return a consistent response format:

### Success Response

```javascript
{
  success: true,
  data: {...}, // or [...]
  message: 'Optional success message'
}
```

### Error Response

```javascript
{
  success: false,
  error: 'Error message'
}
```

## Components Updated

The following components have been updated to use the centralized data service:

1. **WatchDetailsPage** - Product detail fetching
2. **ProductsPage** - All products listing
3. **SuperAdminProfilePage** - Product and order management
4. **ProductEditPage** - Product editing
5. **FeauteredWatches** - Best sellers and latest releases
6. **Carousel** - Carousel image loading
7. **UserProfilePage** - User orders and statistics

## Benefits

1. **Single Source of Truth** - All data operations in one place
2. **Consistency** - Standardized response format and error handling
3. **Maintainability** - Easier to update database queries
4. **Testability** - Easier to mock and test
5. **Reusability** - Methods can be used across multiple components
6. **Image URL Handling** - Automatic image URL generation using `getImageUrl`

## Dependencies

- `supabase` - Database and storage client
- `imageService` - For generating proper image URLs

## Notes

- All image URLs are automatically generated with proper paths
- Featured watches are checked first when fetching by ID
- Order statistics are calculated from the orders table
- Image operations handle both database and storage cleanup

# Backend Integration Documentation

## Overview
This admin panel has been integrated with the new Mariah Universe backend API deployed at `https://mariah-universe-backend.vercel.app/`.

## API Configuration

### Environment Variables
Create a `.env` file in the root directory to configure the backend URL:

```env
REACT_APP_API_BASE_URL=https://mariah-universe-backend.vercel.app/
```

### Service Layer
The application uses a service layer architecture for API interactions:

- `authService`: Authentication and user management
- `servicesService`: Services CRUD operations  
- `subServicesService`: Sub-services CRUD operations
- `testimonialsService`: Testimonials CRUD operations
- `galleryService`: Gallery CRUD operations

### API Endpoints
All services use the following endpoint structure:

```
POST   /api/auth/login           # User authentication
POST   /api/auth/refresh-token   # Token refresh
GET    /api/services             # Get all services
POST   /api/services             # Create service
PUT    /api/services/:id         # Update service
DELETE /api/services/:id         # Delete service
```

Similar patterns apply for sub-services, testimonials, and gallery endpoints.

## Authentication
- Uses JWT token-based authentication
- Tokens are stored in localStorage
- Automatic token refresh on 401 responses
- Automatic redirect to login on authentication failure

## Error Handling
- Consistent error handling across all services
- User-friendly error messages
- Network timeout handling (10 seconds)
- Fallback error messages for common network issues

## Testing the Integration

1. Ensure the backend is running and accessible
2. Update the API base URL in `.env` if needed
3. Test authentication with valid credentials
4. Verify CRUD operations work for all entities

## Troubleshooting

### Backend Not Accessible
If you see network errors:
1. Verify the backend URL is correct
2. Check if the backend is deployed and running
3. Verify CORS is configured properly on the backend
4. Test backend accessibility with curl or Postman

### Authentication Issues
1. Check if the login endpoint accepts the expected payload format
2. Verify token format and storage
3. Check CORS credentials configuration

### CRUD Operation Issues
1. Verify endpoint paths match backend implementation
2. Check request/response data formats
3. Ensure proper file upload handling for multipart requests
# POST API Endpoint

## Overview

Endpoint POST digunakan untuk membuat resource baru di server. POST requests are not idempotent - multiple identical requests may create multiple resources.

## Syntax

```txt
POST /api/{resource}
```

## Authentication

Most POST endpoints require authentication. Some public endpoints (like user registration) may not require it.

### Authentication Methods

#### Bearer Token

```txt
Authorization: Bearer {access_token}
```

#### API Key

```txt
X-API-Key: {api_key}
```

#### No Authentication

For public endpoints like registration or contact forms.

## Headers

### Required Headers

```txt
Content-Type: application/json
```

### Conditional Headers

```txt
Authorization: Bearer {token}  # For protected endpoints
```

### Optional Headers

```txt
X-Request-ID: {unique_request_id}
X-Idempotency-Key: {idempotency_key}
X-Client-Version: {version}
```

## Path Parameters

### Resource Types

```txt
POST /api/users          # Create new user
POST /api/products       # Create new product
POST /api/orders         # Create new order
POST /api/auth/register  # Specialized endpoints
```

### Nested Resources

```txt
POST /api/users/{user_id}/orders     # Create order for specific user
POST /api/products/{product_id}/reviews  # Create review for product
```

## Request Body

Request body harus berisi data untuk resource yang akan dibuat.

### Basic Creation

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

### Complex Object

```json
{
  "title": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "attributes": {
    "color": "black",
    "weight": "1.5kg",
    "dimensions": {
      "width": 10,
      "height": 20,
      "depth": 5
    }
  },
  "tags": ["new", "featured", "electronics"]
}
```

### With Relationships

```json
{
  "user_id": "12345",
  "items": [
    {
      "product_id": "prod_1",
      "quantity": 2,
      "price": 29.99
    },
    {
      "product_id": "prod_2",
      "quantity": 1,
      "price": 49.99
    }
  ],
  "shipping_address": {
    "street": "123 Main St",
    "city": "Jakarta",
    "postal_code": "12345"
  }
}
```

## Query Parameters

### Optional Parameters

| Parameter     | Type    | Default | Description                     |
| ------------- | ------- | ------- | ------------------------------- |
| validate_only | boolean | false   | Validate without creating       |
| return        | string  | full    | Response format (minimal/full)  |
| async         | boolean | false   | Process creation asynchronously |

### Example with Query Parameters

```txt
POST /api/products?validate_only=true&return=minimal
```

## Responses

### Success Responses

#### 201 Created

Resource successfully created:

```txt
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/550e8400-e29b-41d4-a716-446655440000

{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "users",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "meta": {
    "created": true,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### 202 Accepted

Request accepted for asynchronous processing:

```json
{
  "status": "accepted",
  "message": "Resource creation in progress",
  "job_id": "job_12345",
  "estimated_completion": "2024-01-15T10:35:00Z",
  "status_url": "/api/jobs/job_12345"
}
```

### Error Responses

#### 400 Bad Request

```json
{
  "error": "invalid_request",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Must be a valid email address"],
    "password": ["Must be at least 8 characters"]
  }
}
```

#### 401 Unauthorized

```json
{
  "error": "unauthorized",
  "message": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

#### 403 Forbidden

```json
{
  "error": "forbidden",
  "message": "Insufficient permissions to create this resource",
  "code": "PERMISSION_DENIED"
}
```

#### 409 Conflict

```json
{
  "error": "conflict",
  "message": "Resource already exists",
  "code": "RESOURCE_EXISTS",
  "conflicting_field": "email",
  "existing_id": "12345"
}
```

#### 422 Unprocessable Entity

```json
{
  "error": "unprocessable_entity",
  "message": "Business logic validation failed",
  "code": "BUSINESS_RULE_VIOLATION",
  "details": {
    "stock": ["Insufficient stock available"],
    "price": ["Price below minimum allowed"]
  }
}
```

#### 429 Too Many Requests

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many creation requests",
  "retry_after": 60
}
```

## Examples

### User Registration

```txt
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!",
  "accept_terms": true
}
```

Response:

```txt
HTTP/1.1 201 Created
Location: /api/users/12345

{
  "data": {
    "id": "12345",
    "type": "users",
    "attributes": {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "user",
      "created_at": "2024-01-15T10:30:00Z",
      "email_verified": false
    }
  },
  "meta": {
    "message": "User registered successfully. Please check your email for verification."
  }
}
```

### Product Creation

```txt
POST /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Smartphone Pro",
  "description": "Latest smartphone with advanced features",
  "sku": "SP-PRO-2024",
  "price": 899.99,
  "currency": "USD",
  "stock_quantity": 100,
  "categories": ["electronics", "mobile"],
  "specifications": {
    "screen": "6.7 inch OLED",
    "storage": "256GB",
    "camera": "48MP triple camera"
  },
  "images": [
    {
      "url": "https://example.com/images/product1.jpg",
      "alt": "Smartphone Pro front view"
    }
  ]
}
```

Response:

```json
{
  "data": {
    "id": "prod_67890",
    "type": "products",
    "attributes": {
      "name": "Smartphone Pro",
      "sku": "SP-PRO-2024",
      "price": 899.99,
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Order Creation with Nested Items

```txt
POST /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "user_id": "user_123",
  "items": [
    {
      "product_id": "prod_1",
      "quantity": 2,
      "unit_price": 29.99
    },
    {
      "product_id": "prod_2",
      "quantity": 1,
      "unit_price": 49.99
    }
  ],
  "shipping_address": {
    "recipient": "John Doe",
    "street": "123 Main Street",
    "city": "Jakarta",
    "postal_code": "12345",
    "country": "Indonesia"
  },
  "payment_method": "credit_card",
  "notes": "Please deliver before 5 PM"
}
```

Response:

```json
{
  "data": {
    "id": "order_78901",
    "type": "orders",
    "attributes": {
      "total_amount": 109.97,
      "status": "pending",
      "order_number": "ORD-2024-001",
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "meta": {
    "next_steps": ["Complete payment within 30 minutes", "Check email for payment instructions"]
  }
}
```

## Special Features

### Idempotency Key

Prevent duplicate creations with idempotency key:

```txt
POST /api/orders
X-Idempotency-Key: order_123_20240115
```

### Bulk Creation

Some endpoints support bulk operations:

```json
{
  "items": [
    { "name": "Item 1", "price": 10.0 },
    { "name": "Item 2", "price": 20.0 },
    { "name": "Item 3", "price": 30.0 }
  ]
}
```

### Async Processing

For long-running operations:

```txt
POST /api/reports?async=true
```

## Validation

### Required Fields

Each resource type has specific required fields.

### Data Type Validation

- String length and format
- Numeric ranges
- Email and URL validation
- Date format validation

### Business Rules

- Unique constraints
- Relationship validity
- Stock availability
- Price rules

## Security Considerations

### Input Sanitization

All input is sanitized to prevent:

- SQL injection
- XSS attacks
- NoSQL injection

### Field-level Permissions

Different user roles can create resources with different field sets.

### Rate Limiting

Creation endpoints have stricter rate limits to prevent abuse.

## Performance

### Response Time

- Simple creations: < 100ms
- Complex creations: < 500ms
- Async operations: Immediate acceptance

### Bulk Operations

Use bulk endpoints instead of multiple POST requests for better performance.

## Error Handling

### Retry Logic

- 429 errors: Retry after retry-after period
- 5xx errors: Retry with exponential backoff
- 4xx errors: Fix request before retrying

### Duplicate Detection

Use idempotency keys to handle retries safely.

## Testing

### Test Cases

```javascript
describe('POST /api/users', () => {
  it('should create user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    }

    const response = await request(app).post('/api/users').send(userData).expect(201)

    expect(response.body.data.id).toBeDefined()
    expect(response.body.data.attributes.email).toBe('test@example.com')
  })

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test' }) // Missing email and password
      .expect(400)

    expect(response.body.details.email).toBeDefined()
    expect(response.body.details.password).toBeDefined()
  })
})
```

## Related Endpoints

- GET /api/{resource} - List resources
- GET /api/{resource}/{id} - Get specific resource
- PUT /api/{resource}/{id} - Replace resource
- PATCH /api/{resource}/{id} - Partial update
- DELETE /api/{resource}/{id} - Delete resource

## Rate Limiting

POST endpoints have the following rate limits:

- User registration: 5 requests per hour per IP
- Content creation: 60 requests per minute
- Bulk operations: 10 requests per minute
- Admin operations: 300 requests per minute

## Versioning

### API Version

This endpoint is available in:

- v1.0: Basic creation functionality
- v1.1: Added bulk operations and async processing
- v2.0: Enhanced validation and error responses

## Support

For issues with POST operations:

- Check validation errors in response
- Verify required fields and formats
- Review rate limiting headers
- Contact support with specific error details

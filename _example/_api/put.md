# PUT API Endpoint

## Overview

Endpoint PUT digunakan untuk mengganti seluruh resource yang sudah ada. PUT requests are idempotent - multiple identical requests should have the same effect as single request. If the resource doesn't exist, it may be created (upsert behavior) depending on API design.

## Syntax

```txt
PUT /api/{resource}/{id}
```

## Authentication

Semua PUT requests memerlukan autentikasi.

### Authentication Methods

#### Bearer Token

```txt
Authorization: Bearer {access_token}
```

#### API Key

```txt
X-API-Key: {api_key}
```

## Headers

### Required Headers

```txt
Content-Type: application/json
Authorization: Bearer {token}
```

### Optional Headers

```txt
X-Request-ID: {unique_request_id}
If-Match: {etag}  # For optimistic concurrency control
If-None-Match: *   # For conditional creation
```

## Path Parameters

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| id        | string | Yes      | Unique identifier of the resource to replace |

### Example Paths

```txt
PUT /api/users/550e8400-e29b-41d4-a716-446655440000
PUT /api/products/12345
PUT /api/orders/ORD-2024-001
```

## Request Body

Request body harus berisi representasi lengkap dari resource. Field yang tidak disertakan akan direset ke nilai default.

### Complete Resource Representation

```json
{
  "name": "Updated Full Name",
  "email": "updated@example.com",
  "role": "user",
  "profile": {
    "bio": "Updated biography",
    "website": "https://updated.example.com",
    "location": "Updated Location"
  },
  "settings": {
    "email_notifications": true,
    "privacy_level": "public"
  }
}
```

### With All Required Fields

```json
{
  "title": "Updated Product Title",
  "description": "Updated product description",
  "price": 129.99,
  "category": "updated-category",
  "status": "active",
  "specifications": {
    "weight": "2.0kg",
    "dimensions": "10x20x15cm"
  }
}
```

## Query Parameters

### Optional Parameters

| Parameter     | Type    | Default | Description                         |
| ------------- | ------- | ------- | ----------------------------------- |
| upsert        | boolean | false   | Create resource if it doesn't exist |
| validate_only | boolean | false   | Validate without applying changes   |
| return        | string  | full    | Response format (minimal/full)      |

### Example with Query Parameters

```txt
PUT /api/users/123?upsert=true&validate_only=false
```

## Responses

### Success Responses

#### 200 OK

Resource successfully updated:

```json
{
  "data": {
    "id": "123",
    "type": "users",
    "attributes": {
      "name": "Updated Full Name",
      "email": "updated@example.com",
      "role": "user",
      "updated_at": "2024-01-15T12:00:00Z"
    }
  },
  "meta": {
    "action": "updated",
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

#### 201 Created

Resource created (when using upsert):

```txt
HTTP/1.1 201 Created
Location: /api/users/123
Content-Type: application/json

{
  "data": {
    "id": "123",
    "type": "users",
    "attributes": {
      "name": "New User",
      "email": "new@example.com",
      "created_at": "2024-01-15T12:00:00Z"
    }
  },
  "meta": {
    "action": "created",
    "timestamp": "2024-01-15T12:00:00Z"
  }
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
    "price": ["Must be greater than 0"]
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
  "message": "Insufficient permissions to update this resource",
  "code": "PERMISSION_DENIED"
}
```

#### 404 Not Found

```json
{
  "error": "not_found",
  "message": "Resource not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

#### 409 Conflict

```json
{
  "error": "conflict",
  "message": "Resource has been modified since last read",
  "code": "CONCURRENT_MODIFICATION",
  "current_etag": "etag_xyz789"
}
```

#### 412 Precondition Failed

```json
{
  "error": "precondition_failed",
  "message": "Conditional request failed",
  "code": "PRECONDITION_FAILED"
}
```

## Examples

### Full User Update

```txt
PUT /api/users/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "user",
  "profile": {
    "bio": "Software engineer with focus on backend systems",
    "website": "https://johnsmith.example.com",
    "location": "San Francisco, CA"
  },
  "settings": {
    "email_notifications": true,
    "sms_notifications": false,
    "privacy_level": "private"
  }
}
```

Response:

```json
{
  "data": {
    "id": "123",
    "type": "users",
    "attributes": {
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "user",
      "profile": {
        "bio": "Software engineer with focus on backend systems",
        "website": "https://johnsmith.example.com",
        "location": "San Francisco, CA"
      },
      "settings": {
        "email_notifications": true,
        "sms_notifications": false,
        "privacy_level": "private"
      },
      "updated_at": "2024-01-15T12:00:00Z"
    }
  }
}
```

### Upsert Operation

```txt
PUT /api/products/prod_123?upsert=true
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Smartphone X",
  "description": "Latest smartphone model",
  "price": 799.99,
  "category": "electronics",
  "status": "active",
  "inventory": {
    "stock": 50,
    "reserved": 0
  }
}
```

Response (if created):

```txt
HTTP/1.1 201 Created
Location: /api/products/prod_123

{
  "data": {
    "id": "prod_123",
    "type": "products",
    "attributes": {
      "name": "Smartphone X",
      "description": "Latest smartphone model",
      "price": 799.99,
      "status": "active",
      "created_at": "2024-01-15T12:00:00Z"
    }
  },
  "meta": {
    "action": "created"
  }
}
```

### Conditional Update with ETag

```txt
PUT /api/orders/ORD-2024-001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
If-Match: "etag_abc123"

{
  "status": "shipped",
  "shipped_at": "2024-01-15T12:00:00Z",
  "tracking_number": "TRK123456789",
  "shipping_carrier": "express_courier"
}
```

## Special Behaviors

### Upsert Behavior

When upsert=true:

- If resource exists: full update
- If resource doesn't exist: create with provided ID
- Default fields are set to their default values

### Conditional Requests

- If-Match: Update only if ETag matches
- If-None-Match: \* - Update only if resource doesn't exist

### Idempotency

PUT requests are idempotent:

- Same request can be sent multiple times
- Result will be the same after first successful request
- Useful for retry logic

## Validation

### Complete Validation

All fields are validated as if creating a new resource:

- Required fields must be present
- Field types and formats validated
- Business rules enforced
- Relationships validated

### Read-only Fields

Some fields cannot be updated via PUT:

- id (immutable)
- created_at (immutable)
- created_by (immutable)

### Default Values

Missing fields are set to their default values, which may differ from current values.

## Security Considerations

### Ownership Validation

Users can typically only update resources they own.

### Field-level Security

Different user roles may have restrictions on which fields they can update.

### Audit Trail

All PUT operations are logged with:

- Previous state
- New state
- User who made changes
- Timestamp

## Performance

### Response Size

Use field selection to control response size:

```txt
PUT /api/users/123?fields=id,name,email
```

### Bulk Updates

For multiple updates, consider using PATCH or specialized bulk endpoints.

## Error Handling

### Retry Logic

- 409 Conflict: Refresh resource and retry
- 429 Rate Limit: Retry after specified time
- 5xx Errors: Retry with exponential backoff

### Concurrent Modifications

Use ETags to handle concurrent modifications gracefully.

## Testing

### Test Cases

```javascript
describe('PUT /api/users/:id', () => {
  it('should update user completely', async () => {
    const userData = {
      name: 'Updated Name',
      email: 'updated@example.com',
      role: 'user',
    }

    const response = await request(app)
      .put('/api/users/123')
      .set('Authorization', 'Bearer valid_token')
      .send(userData)
      .expect(200)

    expect(response.body.data.attributes.name).toBe('Updated Name')
    expect(response.body.data.attributes.email).toBe('updated@example.com')
  })

  it('should create user with upsert', async () => {
    const userData = {
      name: 'New User',
      email: 'new@example.com',
      role: 'user',
    }

    const response = await request(app)
      .put('/api/users/456?upsert=true')
      .set('Authorization', 'Bearer valid_token')
      .send(userData)
      .expect(201)

    expect(response.body.data.id).toBe('456')
    expect(response.body.meta.action).toBe('created')
  })
})
```

## Related Endpoints

- PATCH /api/{resource}/{id} - Partial update
- POST /api/{resource} - Create new resource
- GET /api/{resource}/{id} - Retrieve resource
- DELETE /api/{resource}/{id} - Delete resource

## Rate Limiting

PUT endpoints have moderate rate limits:

- Standard users: 60 requests per minute
- Power users: 300 requests per minute
- Admin users: 600 requests per minute

## Versioning

### API Version

This endpoint is available in:

- v1.0: Basic put functionality
- v1.1: Added upsert and conditional requests
- v2.0: Enhanced validation and error handling

## Support

For issues with PUT operations:

- Check validation errors in response
- Verify all required fields are included
- Review ETag headers for concurrent modifications
- Contact support with specific error details

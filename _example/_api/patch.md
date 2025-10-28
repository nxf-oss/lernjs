# PATCH API Endpoint

## Overview

Endpoint PATCH digunakan untuk melakukan partial update pada resource yang sudah ada. Berbeda dengan PUT yang mengganti seluruh resource, PATCH hanya mengupdate field-field yang disediakan dalam request.

## Syntax

```txt
PATCH /api/{resource}/{id}
```

## Authentication

Semua PATCH requests memerlukan autentikasi.

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
```

## Path Parameters

| Parameter | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| id        | string | Yes      | Unique identifier of the resource to update |

### Example Paths

```txt
PATCH /api/users/550e8400-e29b-41d4-a716-446655440000
PATCH /api/products/12345
PATCH /api/orders/ORD-2024-001
```

## Request Body

Request body harus berisi field-field yang ingin diupdate saja.

### Basic Update

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Nested Field Update

```json
{
  "profile": {
    "bio": "Updated biography",
    "website": "https://updated.example.com"
  }
}
```

### Array Operations

```json
{
  "tags": ["new", "updated", "tags"],
  "settings": {
    "notifications": true,
    "privacy": "private"
  }
}
```

## Query Parameters

### Optional Parameters

| Parameter     | Type    | Default | Description                       |
| ------------- | ------- | ------- | --------------------------------- |
| validate_only | boolean | false   | Validate without applying changes |
| return        | string  | minimal | Response format (minimal/full)    |

### Example with Query Parameters

```txt
PATCH /api/users/123?validate_only=true&return=full
```

## Responses

### Success Responses

#### 200 OK

Update successful, returns updated resource:

```json
{
  "data": {
    "id": "123",
    "type": "users",
    "attributes": {
      "name": "Updated Name",
      "email": "updated@example.com",
      "updated_at": "2024-01-15T11:30:00Z"
    }
  },
  "meta": {
    "updated_fields": ["name", "email"],
    "timestamp": "2024-01-15T11:30:00Z"
  }
}
```

#### 202 Accepted

Update accepted and being processed asynchronously:

```json
{
  "status": "accepted",
  "message": "Update is being processed",
  "job_id": "job_12345",
  "estimated_completion": "2024-01-15T11:35:00Z"
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
    "age": ["Must be greater than 0"]
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
  "current_version": "etag_abc123"
}
```

#### 422 Unprocessable Entity

```json
{
  "error": "unprocessable_entity",
  "message": "Business logic validation failed",
  "code": "BUSINESS_RULE_VIOLATION",
  "details": {
    "status": ["Cannot transition from current status"]
  }
}
```

## Examples

### Basic User Profile Update

```txt
PATCH /api/users/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "profile": {
    "bio": "Software developer with 5 years experience",
    "location": "San Francisco"
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
      "profile": {
        "bio": "Software developer with 5 years experience",
        "location": "San Francisco",
        "website": null
      },
      "updated_at": "2024-01-15T11:30:00Z"
    }
  }
}
```

### Partial Update with Validation Only

```txt
PATCH /api/products/456?validate_only=true
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "price": -10.00,
  "name": "New Product Name"
}
```

Response:

```json
{
  "valid": false,
  "errors": {
    "price": ["Must be greater than 0"]
  },
  "warnings": {
    "name": ["Consider adding a more descriptive name"]
  }
}
```

### Optimistic Concurrency Control

```txt
PATCH /api/orders/789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
If-Match: "etag_abc123"

{
  "status": "shipped",
  "tracking_number": "TRK123456789"
}
```

## Special Operations

### Array Operations

```json
{
  "$add": {
    "tags": ["new-tag"],
    "categories": ["electronics"]
  },
  "$remove": {
    "tags": ["old-tag"]
  }
}
```

### Increment/Decrement Operations

```json
{
  "$inc": {
    "view_count": 1,
    "download_count": 5
  },
  "$dec": {
    "stock_quantity": 1
  }
}
```

### Conditional Updates

```json
{
  "status": "approved",
  "approved_at": "2024-01-15T12:00:00Z",
  "$cond": {
    "if": { "current_status": "pending" },
    "then": { "status": "approved" },
    "else": { "error": "Invalid status transition" }
  }
}
```

## Validation

### Field Validation

- Data type validation
- Format validation (email, URL, etc.)
- Range validation (min/max values)
- Custom business rules

### Cross-field Validation

```json
{
  "start_date": "2024-02-01",
  "end_date": "2024-01-01" // This would fail validation
}
```

### Dependency Validation

Some fields may require other fields to be present or have specific values.

## Security Considerations

### Field-level Permissions

Different user roles may have permission to update different sets of fields.

### Read-only Fields

Some fields cannot be updated via PATCH:

- id
- created_at
- created_by

### Audit Trail

All updates are logged with:

- User who made the change
- Timestamp
- Previous and new values
- IP address

## Performance

### Partial Response

Use field selection to reduce response size:

```txt
PATCH /api/users/123?fields=id,name,email
```

### Batch Operations

For multiple updates, consider using batch endpoints instead of multiple PATCH requests.

## Error Handling

### Retry Logic

- 409 Conflict: Refresh resource and retry
- 429 Rate Limit: Retry after specified time
- 5xx Errors: Retry with exponential backoff

### Idempotency

PATCH operations are generally not idempotent. Use PUT for idempotent updates.

## Testing

### Test Cases

```javascript
describe('PATCH /api/users/:id', () => {
  it('should update user profile', async () => {
    const updateData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    }

    const response = await request(app)
      .patch('/api/users/123')
      .set('Authorization', 'Bearer valid_token')
      .send(updateData)
      .expect(200)

    expect(response.body.data.attributes.name).toBe('Updated Name')
  })

  it('should validate required fields', async () => {
    const response = await request(app)
      .patch('/api/users/123')
      .set('Authorization', 'Bearer valid_token')
      .send({ email: 'invalid-email' })
      .expect(400)

    expect(response.body.details.email).toBeDefined()
  })
})
```

## Related Endpoints

- PUT /api/{resource}/{id} - Replace entire resource
- POST /api/{resource} - Create new resource
- GET /api/{resource}/{id} - Retrieve resource
- DELETE /api/{resource}/{id} - Delete resource

## Rate Limiting

PATCH endpoints have moderate rate limits:

- Standard users: 60 requests per minute
- Power users: 300 requests per minute
- Admin users: 600 requests per minute

## Versioning

### API Version

This endpoint is available in:

- v1.0: Basic partial update functionality
- v1.1: Added array operations and conditional updates
- v2.0: JSON Patch format support

### JSON Patch Format

v2.0 supports RFC 6902 JSON Patch:

```json
[
  { "op": "replace", "path": "/name", "value": "New Name" },
  { "op": "add", "path": "/tags/-", "value": "new-tag" },
  { "op": "remove", "path": "/old_field" }
]
```

## Support

For issues with PATCH operations:

- Check validation errors in response
- Verify field-level permissions
- Review audit logs for previous changes
- Contact support with specific error details

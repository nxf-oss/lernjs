# GET API Endpoint

## Overview

Endpoint GET digunakan untuk mengambil data dari server. GET requests should be safe and idempotent - they should not modify any resources on the server.

## Syntax

```txt
GET /api/{resource}
GET /api/{resource}/{id}
```

## Authentication

Most GET endpoints require authentication. Some public endpoints may not require it.

### Authentication Methods

#### Bearer Token

```txt
Authorization: Bearer {access_token}
```

#### API Key

```txt
X-API-Key: {api_key}
```

#### Session Cookie

For web applications, session cookies may be used.

## Headers

### Required Headers

```txt
Accept: application/json
```

### Optional Headers

```txt
Authorization: Bearer {token}
X-API-Key: {api_key}
X-Request-ID: {unique_request_id}
If-None-Match: {etag}
If-Modified-Since: {timestamp}
```

## Path Parameters

### Resource Collection

```txt
GET /api/users
GET /api/products
GET /api/orders
```

### Specific Resource

```txt
GET /api/users/{id}
GET /api/products/{sku}
GET /api/orders/{order_id}
```

### Nested Resources

```txt
GET /api/users/{user_id}/orders
GET /api/products/{product_id}/reviews
GET /api/orders/{order_id}/items
```

## Query Parameters

### Pagination

| Parameter | Type    | Default | Description             |
| --------- | ------- | ------- | ----------------------- |
| page      | integer | 1       | Page number             |
| limit     | integer | 20      | Items per page          |
| offset    | integer | 0       | Number of items to skip |

### Sorting

| Parameter | Type   | Default    | Description               |
| --------- | ------ | ---------- | ------------------------- |
| sort      | string | created_at | Field to sort by          |
| order     | string | desc       | Sort direction (asc/desc) |

### Filtering

| Parameter     | Type   | Description              |
| ------------- | ------ | ------------------------ |
| filter[field] | string | Filter by specific field |
| search        | string | Full-text search         |
| status        | string | Filter by status         |
| date_from     | date   | Start date range         |
| date_to       | date   | End date range           |

### Field Selection

| Parameter | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| fields    | string | Comma-separated list of fields to include |
| exclude   | string | Comma-separated list of fields to exclude |

### Examples with Query Parameters

#### Basic Pagination

```txt
GET /api/users?page=2&limit=10
```

#### Sorting and Filtering

```txt
GET /api/products?sort=price&order=asc&filter[category]=electronics&status=active
```

#### Field Selection

```txt
GET /api/users/123?fields=id,name,email&exclude=password,metadata
```

#### Date Range

```txt
GET /api/orders?date_from=2024-01-01&date_to=2024-01-15&status=completed
```

## Responses

### Success Responses

#### 200 OK

Successful request with response body:

```json
{
  "data": [
    {
      "id": "123",
      "type": "users",
      "attributes": {
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total_count": 150,
    "total_pages": 8
  },
  "links": {
    "self": "/api/users?page=1",
    "next": "/api/users?page=2",
    "prev": null,
    "last": "/api/users?page=8"
  }
}
```

#### 200 OK - Single Resource

```json
{
  "data": {
    "id": "123",
    "type": "users",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com",
      "profile": {
        "age": 30,
        "location": "Jakarta"
      }
    },
    "relationships": {
      "orders": {
        "links": {
          "related": "/api/users/123/orders"
        }
      }
    }
  }
}
```

#### 304 Not Modified

When using caching headers and content hasn't changed:

```txt
HTTP/1.1 304 Not Modified
ETag: "abc123"
Last-Modified: Mon, 15 Jan 2024 10:30:00 GMT
```

### Error Responses

#### 400 Bad Request

```json
{
  "error": "invalid_request",
  "message": "Invalid query parameters",
  "code": "VALIDATION_ERROR",
  "details": {
    "limit": ["Must be between 1 and 100"]
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
  "message": "Insufficient permissions to access this resource",
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

#### 429 Too Many Requests

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 60
}
```

## Examples

### Get All Users with Pagination

```txt
GET /api/users?page=1&limit=10&sort=name&order=asc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "data": [
    {
      "id": "1",
      "type": "users",
      "attributes": {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "role": "user",
        "created_at": "2024-01-10T08:30:00Z"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total_count": 150,
    "total_pages": 15
  }
}
```

### Get Single Product

```txt
GET /api/products/prod_12345
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "data": {
    "id": "prod_12345",
    "type": "products",
    "attributes": {
      "name": "Smartphone X",
      "description": "Latest smartphone with advanced features",
      "price": 799.99,
      "currency": "USD",
      "in_stock": true,
      "specifications": {
        "screen": "6.1 inch",
        "storage": "128GB",
        "camera": "12MP"
      }
    }
  }
}
```

### Get User's Orders

```txt
GET /api/users/123/orders?status=completed&date_from=2024-01-01
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "data": [
    {
      "id": "order_789",
      "type": "orders",
      "attributes": {
        "total_amount": 199.99,
        "status": "completed",
        "created_at": "2024-01-05T14:20:00Z"
      }
    }
  ]
}
```

## Caching

### ETag Support

Most GET endpoints support ETag for caching:

```txt
GET /api/products/123
If-None-Match: "abc123"
```

### Last-Modified

```txt
GET /api/products/123
If-Modified-Since: Mon, 15 Jan 2024 10:30:00 GMT
```

### Cache-Control Headers

Responses include cache directives:

```txt
Cache-Control: public, max-age=300
ETag: "xyz789"
Last-Modified: Mon, 15 Jan 2024 10:30:00 GMT
```

## Rate Limiting

GET endpoints have the following rate limits:

- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute
- High-volume endpoints: Special limits apply

## Performance Considerations

### Pagination

Always use pagination for large datasets:

- Default limit: 20 items
- Maximum limit: 100 items
- Use cursor-based pagination for very large datasets

### Field Selection

Use field selection to reduce payload size:

```txt
GET /api/users?fields=id,name,email
```

### Compression

Responses are compressed with gzip when supported by client.

## Error Handling

### Common Error Scenarios

- Invalid authentication credentials
- Insufficient permissions
- Invalid query parameters
- Resource not found
- Rate limit exceeded

### Retry Logic

- 5xx errors: Retry with exponential backoff
- 429 errors: Retry after retry-after period
- 4xx errors: Do not retry without fixing the request

## Testing

### Example Test Cases

```javascript
describe('GET /api/users', () => {
  it('should return paginated users', async () => {
    const response = await request(app)
      .get('/api/users?page=1&limit=5')
      .set('Authorization', 'Bearer valid_token')
      .expect(200)

    expect(response.body.data).toHaveLength(5)
    expect(response.body.meta.page).toBe(1)
  })

  it('should require authentication', async () => {
    await request(app).get('/api/users').expect(401)
  })
})
```

## Security

### Data Exposure

- Sensitive fields are excluded by default
- Field-level permissions based on user roles
- Data filtering based on ownership

### SQL Injection Prevention

- All queries use parameterized statements
- Input validation on all parameters
- No direct user input in SQL queries

## Versioning

### API Version

This endpoint is available in:

- v1.0: Basic functionality
- v1.1: Added field selection and advanced filtering
- v2.0: JSON:API compliant responses

### Version Headers

```txt
Accept: application/vnd.api+json; version=2
```

## Related Endpoints

- POST /api/{resource} - Create new resource
- PUT /api/{resource}/{id} - Update resource
- PATCH /api/{resource}/{id} - Partial update
- DELETE /api/{resource}/{id} - Delete resource

## Support

For issues with GET requests:

- Check the API status page
- Verify authentication credentials
- Review query parameter documentation
- Contact support with X-Request-ID

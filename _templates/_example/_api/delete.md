# DELETE API Endpoint

## Overview

Endpoint DELETE digunakan untuk menghapus resource yang ada di server. Operasi DELETE bersifat idempoten - multiple identical requests should have the same effect as single request.

## Syntax

```txt
DELETE /api/{resource}/{id}
```

## Authentication

Semua request DELETE memerlukan autentikasi. Gunakan salah satu metode berikut:

### Bearer Token

```txt
Authorization: Bearer {access_token}
```

### API Key

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
X-Client-Version: {version}
```

## Path Parameters

### Resource ID

| Parameter | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| id        | string | Yes      | Unique identifier of the resource to delete |

### Example Path Parameters

```txt
DELETE /api/users/550e8400-e29b-41d4-a716-446655440000
DELETE /api/products/12345
DELETE /api/orders/ORD-2024-001
```

## Query Parameters

### Optional Parameters

| Parameter | Type    | Default | Description                                 |
| --------- | ------- | ------- | ------------------------------------------- |
| force     | boolean | false   | Force deletion bypassing soft delete        |
| cascade   | boolean | false   | Delete related resources                    |
| confirm   | string  | -       | Confirmation token for sensitive operations |

### Example with Query Parameters

```txt
DELETE /api/users/123?force=true&cascade=true
DELETE /api/data/456?confirm=delete_acknowledged
```

## Request Body

### No Body (Typically)

Most DELETE requests don't require a request body.

### With Body (Special Cases)

```json
{
  "reason": "user_request",
  "deletion_type": "hard",
  "backup_required": true
}
```

## Responses

### Success Responses

#### 200 OK

Resource successfully deleted, with response body:

```json
{
  "status": "success",
  "message": "Resource deleted successfully",
  "deleted_id": "12345",
  "deleted_at": "2024-01-15T10:30:00Z",
  "backup_available_until": "2024-02-15T10:30:00Z"
}
```

#### 204 No Content

Resource successfully deleted, no response body.

### Error Responses

#### 400 Bad Request

```json
{
  "error": "invalid_request",
  "message": "Missing required parameter: id",
  "code": "VALIDATION_ERROR"
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
  "message": "Insufficient permissions to delete this resource",
  "code": "PERMISSION_DENIED"
}
```

#### 404 Not Found

```json
{
  "error": "not_found",
  "message": "Resource with id 12345 not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

#### 409 Conflict

```json
{
  "error": "conflict",
  "message": "Resource cannot be deleted due to existing dependencies",
  "code": "DEPENDENCY_EXISTS",
  "dependencies": ["orders", "subscriptions"]
}
```

#### 429 Too Many Requests

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many delete requests",
  "retry_after": 60
}
```

## Examples

### Basic Delete Operation

```txt
DELETE /api/users/12345
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```txt
HTTP/1.1 204 No Content
```

### Delete with Confirmation

```txt
DELETE /api/account/me?confirm=permanent_deletion_acknowledged
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "reason": "account_closure",
  "feedback": "Moving to different platform"
}
```

Response:

```json
{
  "status": "success",
  "message": "Account scheduled for deletion",
  "deletion_scheduled_at": "2024-01-20T10:30:00Z",
  "data_retention_days": 30
}
```

### Bulk Delete

```txt
DELETE /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "ids": ["prod_1", "prod_2", "prod_3"],
  "delete_reason": "seasonal_cleanup"
}
```

Response:

```json
{
  "status": "success",
  "message": "3 products deleted successfully",
  "deleted_count": 3,
  "failed_deletions": []
}
```

## Error Handling

### Retry Logic

- Non-2xx responses should not be retried automatically
- 429 responses can be retried after retry-after period
- 5xx errors may be retried with exponential backoff

### Error Codes

| Code              | Description                           | Action           |
| ----------------- | ------------------------------------- | ---------------- |
| DELETE_FORBIDDEN  | Insufficient permissions              | Check user roles |
| RESOURCE_LOCKED   | Resource is locked by another process | Retry later      |
| VALIDATION_FAILED | Request validation failed             | Check parameters |
| RATE_LIMITED      | Too many requests                     | Wait and retry   |

## Security Considerations

### Authorization

- Users can only delete resources they own
- Admin roles required for cross-user deletions
- Sensitive operations require additional confirmation

### Data Protection

- Soft delete implemented by default
- Backup created before permanent deletion
- Audit trail maintained for all deletions

### Prevention of Mass Deletion

- Rate limiting on delete operations
- Confirmation required for bulk operations
- Limits on number of resources deleted per request

## Best Practices

### Client Side

1. Always confirm with user before sending delete request
2. Provide clear feedback about deletion consequences
3. Implement undo functionality where possible
4. Handle errors gracefully with user-friendly messages

### Server Side

1. Implement soft delete where appropriate
2. Maintain audit logs of all deletions
3. Validate ownership and permissions
4. Consider implementing recycle bin functionality

## Testing

### Unit Tests

```javascript
// Example test case
describe('DELETE /api/users/:id', () => {
  it('should delete user successfully', async () => {
    const response = await request(app)
      .delete('/api/users/123')
      .set('Authorization', 'Bearer valid_token')
      .expect(204)
  })
})
```

### Integration Tests

Test scenarios:

- Successful deletion with valid credentials
- Deletion with invalid credentials
- Attempt to delete non-existent resource
- Bulk deletion operations
- Deletion with dependencies

## Rate Limiting

Delete operations are subject to stricter rate limits:

- Standard users: 10 requests per minute
- Power users: 50 requests per minute
- Admin users: 100 requests per minute

## Versioning

### API Version

This endpoint is available in:

- v1.0: Basic delete functionality
- v1.1: Added soft delete and bulk operations
- v2.0: Enhanced security and audit features

### Deprecation

Older versions will be deprecated with 6 months notice.

## Related Endpoints

- PATCH /api/{resource}/{id} - Partial update
- PUT /api/{resource}/{id} - Full update
- GET /api/{resource}/{id} - Retrieve resource
- POST /api/{resource} - Create new resource

## Support

For issues with delete operations:

- Check API status page
- Review error message and code
- Contact support with request details
- Provide X-Request-ID for troubleshooting

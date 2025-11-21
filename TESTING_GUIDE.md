# Testing Guide - HelloWorld API

This guide will help you test all the implemented features including security hardening, API versioning, and Swagger documentation.

## 🚀 Quick Start Testing

### Step 1: Start the Server

```bash
npm start
```

You should see:
```
Server is running on http://localhost:3000
Environment: development
Successfully connected to the MySQL database.
```

### Step 2: Test Swagger Documentation

1. Open your browser and go to: `http://localhost:3000/api-docs`
2. You should see the interactive Swagger UI with all your API endpoints
3. Try expanding any endpoint to see its documentation

---

## 📋 Comprehensive Testing Checklist

### 1. Test Swagger Documentation

**What to test:**
- ✅ Swagger UI loads at `http://localhost:3000/api-docs`
- ✅ All endpoints are visible and documented
- ✅ You can expand endpoints to see details
- ✅ Request/response schemas are shown

**How to test:**
```bash
# Open in browser
http://localhost:3000/api-docs
```

---

### 2. Test API Versioning

**Test the new versioned endpoints:**

```bash
# Test versioned auth endpoint
curl http://localhost:3000/api/v1/auth/login

# Test versioned posts endpoint
curl http://localhost:3000/api/v1/posts

# Test versioned users endpoint
curl http://localhost:3000/api/v1/users
```

**Expected:** All should return responses (even if errors, they should be 404/401, not "route not found")

---

### 3. Test Authentication Flow

#### 3.1 Register a New User

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Using Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/v1/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "message": "User registered successfully"
}
```

#### 3.2 Login to Get JWT Token

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Using Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/v1/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully"
}
```

**Save the token** - you'll need it for authenticated endpoints!

---

### 4. Test Rate Limiting

#### 4.1 Test Auth Rate Limiting (Stricter)

**What to test:** Login endpoint should limit to 5 requests per 15 minutes

**How to test:**
```bash
# Run this command 6 times quickly
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test@example.com\",\"password\":\"wrongpassword\"}"
  echo "Request $i"
done
```

**Expected:** After 5 failed attempts, the 6th should return:
```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again after 15 minutes."
}
```

#### 4.2 Test Global Rate Limiting

**What to test:** Other endpoints should limit to 100 requests per 15 minutes

**How to test:**
```bash
# Make many requests to a public endpoint
for i in {1..101}; do
  curl http://localhost:3000/api/v1/posts
done
```

**Expected:** After 100 requests, you should get a rate limit error

---

### 5. Test CORS

**What to test:** CORS headers should be present in responses

**How to test:**
```bash
curl -X OPTIONS http://localhost:3000/api/v1/posts \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Expected:** Response should include CORS headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

### 6. Test Security Headers (Helmet)

**What to test:** Security headers should be present

**How to test:**
```bash
curl -I http://localhost:3000/api/v1/posts
```

**Expected:** Response headers should include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- And other security headers

---

### 7. Test Protected Endpoints (Require Authentication)

**Replace `YOUR_TOKEN` with the token from step 3.2**

#### 7.1 Create a Post

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"My First Post\",\"content\":\"This is my first post!\"}"
```

**Using Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/v1/posts`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN`
- Body (raw JSON):
```json
{
  "title": "My First Post",
  "content": "This is my first post!"
}
```

**Expected:** Should create post successfully (201 status)

#### 7.2 Test Without Token (Should Fail)

```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"My First Post\",\"content\":\"This is my first post!\"}"
```

**Expected:** Should return 401 Unauthorized

---

### 8. Test Photo Upload

**Using Postman (recommended for file uploads):**

1. Method: `POST`
2. URL: `http://localhost:3000/api/v1/photos/upload`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN`
4. Body: Select `form-data`
   - Key: `photo` (type: File) - Select an image file
   - Key: `caption` (type: Text) - Enter: "My beautiful photo"

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/photos/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/your/image.jpg" \
  -F "caption=My beautiful photo"
```

**Expected:** Should upload successfully and return photo data

---

### 9. Test Swagger UI "Try It Out" Feature

1. Go to `http://localhost:3000/api-docs`
2. Find any endpoint (e.g., `/api/v1/auth/login`)
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"
6. See the response

**For authenticated endpoints:**
1. Click the "Authorize" button at the top
2. Enter your JWT token
3. Click "Authorize"
4. Now test authenticated endpoints

---

### 10. Test Error Handling

#### 10.1 Invalid Endpoint
```bash
curl http://localhost:3000/api/v1/invalid-endpoint
```
**Expected:** 404 Not Found with proper error format

#### 10.2 Invalid JSON
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -d "{invalid json}"
```
**Expected:** 400 Bad Request with error message

#### 10.3 Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"test\"}"
```
**Expected:** 400 Bad Request with validation errors

---

## 🧪 Automated Testing Script

Create a test script to verify everything works:

```bash
# test-api.sh
#!/bin/bash

BASE_URL="http://localhost:3000/api/v1"

echo "Testing API..."

# Test 1: Swagger docs
echo "1. Testing Swagger docs..."
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/../api-docs | grep -q "200" && echo "✅ Swagger docs accessible" || echo "❌ Swagger docs failed"

# Test 2: Get posts (should work)
echo "2. Testing GET /posts..."
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/posts | grep -q "200" && echo "✅ GET /posts works" || echo "❌ GET /posts failed"

# Test 3: Security headers
echo "3. Testing security headers..."
HEADERS=$(curl -s -I $BASE_URL/posts)
echo "$HEADERS" | grep -q "X-Content-Type-Options" && echo "✅ Security headers present" || echo "❌ Security headers missing"

echo "Testing complete!"
```

---

## 📊 Expected Results Summary

| Feature | Test | Expected Result |
|---------|------|----------------|
| Swagger UI | Access `/api-docs` | Should load interactive documentation |
| API Versioning | Use `/api/v1/*` | Should work correctly |
| Authentication | Register & Login | Should return JWT token |
| Rate Limiting | 6+ auth attempts | Should block after 5 attempts |
| CORS | OPTIONS request | Should return CORS headers |
| Security Headers | Any request | Should include Helmet headers |
| Protected Routes | Without token | Should return 401 |
| Protected Routes | With token | Should work correctly |
| File Upload | POST with file | Should upload successfully |

---

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify database connection in `.env`
- Check for syntax errors in code

### 404 errors
- Make sure you're using `/api/v1/` prefix
- Check that routes are properly mounted in `index.js`

### 401 errors
- Make sure you're including `Authorization: Bearer YOUR_TOKEN` header
- Verify token is valid (not expired)
- Check token format: `Bearer <token>` (with space)

### Rate limiting too strict
- Adjust limits in `src/config/security.config.js`
- Wait 15 minutes for rate limit to reset

### CORS errors
- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Verify CORS configuration in `index.js`

---

## ✅ Quick Verification Checklist

Run through these quickly to verify everything works:

- [ ] Server starts without errors
- [ ] Swagger UI loads at `/api-docs`
- [ ] Can register a new user
- [ ] Can login and get JWT token
- [ ] Can access protected endpoint with token
- [ ] Cannot access protected endpoint without token
- [ ] Rate limiting works (test with multiple requests)
- [ ] Security headers are present
- [ ] Photo upload works
- [ ] All endpoints documented in Swagger

---

## 🎯 Next Steps

Once all tests pass:
1. Test with your frontend application
2. Deploy to staging environment
3. Set up monitoring and logging
4. Configure production CORS settings
5. Set up SSL/HTTPS

# Quick API Test Script
# Run with: powershell -ExecutionPolicy Bypass -File test-api.ps1

$baseUrl = "http://localhost:3000/api/v1"
$testEmail = "test@example.com"
$testPassword = "password123"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   HelloWorld API Testing Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Check if server is running
Write-Host "[1/6] Checking if server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api-docs" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Server is running!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Server is not running. Please start it with: npm start" -ForegroundColor Red
    exit
}

# Test 2: Test Swagger Documentation
Write-Host "`n[2/6] Testing Swagger Documentation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api-docs" -Method GET
    Write-Host "   ✅ Swagger docs accessible at http://localhost:3000/api-docs" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Swagger docs not accessible" -ForegroundColor Red
}

# Test 3: Test Public Endpoint (Get Users)
Write-Host "`n[3/6] Testing public endpoint (GET /users)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/users" -Method GET
    $statusCode = $response.StatusCode
    Write-Host "   ✅ GET /users works! Status: $statusCode" -ForegroundColor Green
} catch {
    Write-Host "   ❌ GET /users failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test Login
Write-Host "`n[4/6] Testing authentication (POST /auth/login)..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $responseData = $response.Content | ConvertFrom-Json
    if ($responseData.data.token) {
        $token = $responseData.data.token
        Write-Host "   ✅ Login successful! Token obtained." -ForegroundColor Green
    } else {
        Write-Host "   ❌ Login failed: No token in response" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 Tip: Make sure you have a user registered with email: $testEmail" -ForegroundColor Yellow
    exit
}

# Test 5: Test Protected Endpoint (Get Photos)
Write-Host "`n[5/6] Testing protected endpoint (GET /photos)..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/photos" -Method GET -Headers $headers
    $statusCode = $response.StatusCode
    Write-Host "   ✅ GET /photos works! Status: $statusCode" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ❌ GET /photos failed: Unauthorized (401)" -ForegroundColor Red
    } else {
        Write-Host "   ❌ GET /photos failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: Test Without Token (Should Fail)
Write-Host "`n[6/6] Testing protected endpoint without token (should fail)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/photos" -Method GET
    Write-Host "   ❌ Security issue: Endpoint accessible without token!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ✅ Security working! Endpoint correctly requires authentication (401)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n✅ Basic tests completed!" -ForegroundColor Green
Write-Host "`n📚 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Open http://localhost:3000/api-docs in your browser" -ForegroundColor White
Write-Host "   2. Click 'Authorize' and enter your token: $($token.Substring(0, 20))..." -ForegroundColor White
Write-Host "   3. Test endpoints interactively in Swagger UI" -ForegroundColor White
Write-Host "`n💡 For more detailed testing, see TESTING_GUIDE.md" -ForegroundColor Cyan
Write-Host ""


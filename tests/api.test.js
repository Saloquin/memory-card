/**
 * Automated API Test Suite for Memory Card API
 * 
 * This test suite validates all API endpoints and their business logic
 * Run with: node tests/api.test.js
 */

const BASE_URL = 'http://localhost:3000';

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

// Test results tracking
const results = {
    passed: 0,
    failed: 0,
    total: 0,
    failures: []
};

// Helper function to make HTTP requests
async function request(method, endpoint, body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.text();
        
        return {
            status: response.status,
            data: data ? JSON.parse(data) : null
        };
    } catch (error) {
        return {
            status: 0,
            error: error.message
        };
    }
}

// Test assertion helper
function assert(condition, testName, expectedValue, actualValue) {
    results.total++;
    
    if (condition) {
        results.passed++;
        console.log(`${colors.green}✓${colors.reset} ${testName}`);
        return true;
    } else {
        results.failed++;
        const failureInfo = {
            test: testName,
            expected: expectedValue,
            actual: actualValue
        };
        results.failures.push(failureInfo);
        console.log(`${colors.red}✗${colors.reset} ${testName}`);
        console.log(`  ${colors.gray}Expected: ${JSON.stringify(expectedValue)}${colors.reset}`);
        console.log(`  ${colors.gray}Actual: ${JSON.stringify(actualValue)}${colors.reset}`);
        return false;
    }
}

// Test suite sections
let adminToken = '';
let user1Token = '';
let user2Token = '';
let testCollectionId = '';
let testCardId = '';
let testUserId = '';

async function testAuthEndpoints() {
    console.log(`\n${colors.cyan}=== Testing Authentication Endpoints ===${colors.reset}\n`);
    
    // Test 1: Register new user (with timestamp to ensure uniqueness)
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const registerResponse = await request('POST', '/auth/register', {
        email: testEmail,
        password: 'password123',
        name: 'Doe',
        firstName: 'John'
    });
    assert(
        registerResponse.status === 201,
        'POST /auth/register - Should create new user',
        201,
        registerResponse.status
    );
    
    // Test 2: Register with duplicate email should fail (use same email as test 1)
    const duplicateResponse = await request('POST', '/auth/register', {
        email: testEmail,
        password: 'password123',
        name: 'Test',
        firstName: 'Test'
    });
    assert(
        duplicateResponse.status === 409,
        'POST /auth/register - Should reject duplicate email',
        409,
        duplicateResponse.status
    );
    
    // Test 3: Login with correct credentials
    const loginResponse = await request('POST', '/auth/login', {
        email: 'jean.dupont@example.com',
        password: 'password123'
    });
    assert(
        loginResponse.status === 200 && loginResponse.data?.token,
        'POST /auth/login - Should return JWT token',
        'token exists',
        loginResponse.data?.token ? 'token exists' : 'no token'
    );
    user1Token = loginResponse.data?.token || '';
    
    // Test 4: Login with wrong password
    const wrongPasswordResponse = await request('POST', '/auth/login', {
        email: 'jean.dupont@example.com',
        password: 'wrongpassword'
    });
    assert(
        wrongPasswordResponse.status === 401,
        'POST /auth/login - Should reject wrong password',
        401,
        wrongPasswordResponse.status
    );
    
    // Test 5: Login as admin
    const adminLoginResponse = await request('POST', '/auth/login', {
        email: 'admin@memorycard.com',
        password: 'admin123'
    });
    assert(
        adminLoginResponse.status === 200,
        'POST /auth/login - Should login admin',
        200,
        adminLoginResponse.status
    );
    adminToken = adminLoginResponse.data?.token || '';
    
    // Test 6: Login as user2
    const user2LoginResponse = await request('POST', '/auth/login', {
        email: 'marie.martin@example.com',
        password: 'password123'
    });
    assert(
        user2LoginResponse.status === 200 && user2LoginResponse.data?.token,
        'POST /auth/login - Should login user2',
        'token exists',
        user2LoginResponse.data?.token ? 'token exists' : 'no token'
    );
    user2Token = user2LoginResponse.data?.token || '';
}

async function testCollectionEndpoints() {
    console.log(`\n${colors.cyan}=== Testing Collection Endpoints ===${colors.reset}\n`);
    
    // Test 1: Get user's collections (requires auth)
    const userCollectionsResponse = await request('GET', '/collections/user/', null, user1Token);
    assert(
        userCollectionsResponse.status === 200 && Array.isArray(userCollectionsResponse.data),
        'GET /collections/user - Should return user collections',
        'array',
        Array.isArray(userCollectionsResponse.data) ? 'array' : typeof userCollectionsResponse.data
    );
    
    // Test 2: Get user collections without auth should fail
    const noAuthResponse = await request('GET', '/collections/user/');
    assert(
        noAuthResponse.status === 401,
        'GET /collections/user - Should reject without auth',
        401,
        noAuthResponse.status
    );
    
    // Test 3: Search public collections
    const searchResponse = await request('GET', '/collections/public/French', null, user1Token);
    assert(
        searchResponse.status === 200,
        'GET /collections/public/:query - Should search public collections',
        200,
        searchResponse.status
    );
    
    // Test 4: Create new collection (with timestamp to ensure uniqueness)
    const timestamp = Date.now();
    const createResponse = await request('POST', '/collections/', {
        title: `Test Collection API ${timestamp}`,
        description: 'This is a test collection created by automated tests',
        is_public: false
    }, user1Token);
    assert(
        createResponse.status === 201 && createResponse.data?.collection_id,
        'POST /collections - Should create new collection',
        'collection created',
        createResponse.data?.collection_id ? 'collection created' : 'failed'
    );
    testCollectionId = createResponse.data?.collection_id || '';
    
    // Test 5: Get specific collection
    if (testCollectionId) {
        const getResponse = await request('GET', `/collections/${testCollectionId}`, null, user1Token);
        assert(
            getResponse.status === 200 && getResponse.data?.title?.startsWith('Test Collection API'),
            'GET /collections/:id - Should get collection by ID',
            'starts with Test Collection API',
            getResponse.data?.title
        );
    }
    
    // Test 6: Update collection
    if (testCollectionId) {
        const updateResponse = await request('PUT', `/collections/${testCollectionId}`, {
            title: 'Updated Test Collection',
            description: 'Updated description',
            is_public: true
        }, user1Token);
        assert(
            updateResponse.status === 200,
            'PUT /collections/:id - Should update collection',
            200,
            updateResponse.status
        );
    }
    
    // Test 7: Non-owner cannot update collection
    if (testCollectionId) {
        const unauthorizedUpdateResponse = await request('PUT', `/collections/${testCollectionId}`, {
            title: 'Hacked Collection'
        }, user2Token);
        assert(
            unauthorizedUpdateResponse.status === 403,
            'PUT /collections/:id - Should reject non-owner update',
            403,
            unauthorizedUpdateResponse.status
        );
    }
}

async function testCardEndpoints() {
    console.log(`\n${colors.cyan}=== Testing Card Endpoints ===${colors.reset}\n`);
    
    // Test 1: Create card in collection
    if (testCollectionId) {
        const createResponse = await request('POST', '/cards/', {
            recto: 'Test Question?',
            verso: 'Test Answer',
            recto_url: 'https://example.com/question.jpg',
            verso_url: 'https://example.com/answer.jpg',
            collection_id: testCollectionId
        }, user1Token);
        assert(
            createResponse.status === 201 && createResponse.data?.card_id,
            'POST /cards - Should create new card',
            'card created',
            createResponse.data?.card_id ? 'card created' : 'failed'
        );
        testCardId = createResponse.data?.card_id || '';
    }
    
    // Test 2: Get specific card
    if (testCardId) {
        const getResponse = await request('GET', `/cards/${testCardId}`, null, user1Token);
        assert(
            getResponse.status === 200 && getResponse.data?.recto === 'Test Question?',
            'GET /cards/:id - Should get card by ID',
            'Test Question?',
            getResponse.data?.recto
        );
    }
    
    // Test 3: Update card
    if (testCardId) {
        const updateResponse = await request('PUT', `/cards/${testCardId}`, {
            recto: 'Updated Question?',
            verso: 'Updated Answer',
            recto_url: null,
            verso_url: null
        }, user1Token);
        assert(
            updateResponse.status === 200,
            'PUT /cards/:id - Should update card',
            200,
            updateResponse.status
        );
    }
    
    // Test 4: Get cards from collection
    if (testCollectionId) {
        const cardsResponse = await request('GET', `/cards/collection/${testCollectionId}`, null, user1Token);
        assert(
            cardsResponse.status === 200 && Array.isArray(cardsResponse.data),
            'GET /cards/collection/:id - Should get cards from collection',
            'array',
            Array.isArray(cardsResponse.data) ? 'array' : typeof cardsResponse.data
        );
    }
    
    // Test 5: Non-owner cannot update card
    if (testCardId) {
        const unauthorizedUpdateResponse = await request('PUT', `/cards/${testCardId}`, {
            recto: 'Hacked Question'
        }, user2Token);
        assert(
            unauthorizedUpdateResponse.status === 403,
            'PUT /cards/:id - Should reject non-owner update',
            403,
            unauthorizedUpdateResponse.status
        );
    }
}

async function testReviewEndpoints() {
    console.log(`\n${colors.cyan}=== Testing Review Endpoints ===${colors.reset}\n`);
    
    // Test 1: Get cards to review from collection
    if (testCollectionId) {
        const cardsToReviewResponse = await request('GET', `/reviews/collection/${testCollectionId}/review`, null, user1Token);
        assert(
            cardsToReviewResponse.status === 200,
            'GET /reviews/collection/:id/review - Should get cards to review',
            200,
            cardsToReviewResponse.status
        );
    }
    
    // Test 2: Review a card (first time)
    if (testCardId) {
        const reviewResponse = await request('POST', `/reviews/${testCardId}/review`, {
            level_id: 3
        }, user1Token);
        assert(
            reviewResponse.status === 201,
            'POST /reviews/:id/review - Should review card for first time',
            201,
            reviewResponse.status
        );
        
        // Verify next_review_date is calculated
        assert(
            reviewResponse.data?.next_review_date !== undefined,
            'POST /reviews/:id/review - Should return next_review_date',
            'date exists',
            reviewResponse.data?.next_review_date ? 'date exists' : 'no date'
        );
    }
    
    // Test 3: Review same card again (update)
    if (testCardId) {
        const updateReviewResponse = await request('POST', `/reviews/${testCardId}/review`, {
            level_id: 5
        }, user1Token);
        assert(
            updateReviewResponse.status === 200,
            'POST /reviews/:id/review - Should update existing review',
            200,
            updateReviewResponse.status
        );
    }
    
    // Test 4: Review with invalid level should fail
    if (testCardId) {
        const invalidLevelResponse = await request('POST', `/reviews/${testCardId}/review`, {
            level_id: 6
        }, user1Token);
        assert(
            invalidLevelResponse.status === 400,
            'POST /reviews/:id/review - Should reject invalid level',
            400,
            invalidLevelResponse.status
        );
    }
    
    // Test 5: Review without auth should fail
    if (testCardId) {
        const noAuthResponse = await request('POST', `/reviews/${testCardId}/review`, {
            level_id: 3
        });
        assert(
            noAuthResponse.status === 401,
            'POST /reviews/:id/review - Should reject without auth',
            401,
            noAuthResponse.status
        );
    }
}

async function testUserEndpoints() {
    console.log(`\n${colors.cyan}=== Testing User Management Endpoints (Admin) ===${colors.reset}\n`);
    
    // Test 1: Get all users (admin only)
    const usersResponse = await request('GET', '/users/', null, adminToken);
    assert(
        usersResponse.status === 200 && Array.isArray(usersResponse.data),
        'GET /users - Admin should get all users',
        'array',
        Array.isArray(usersResponse.data) ? 'array' : typeof usersResponse.data
    );
    
    if (usersResponse.data && usersResponse.data.length > 0) {
        testUserId = usersResponse.data[usersResponse.data.length - 1].user_id;
    }
    
    // Test 2: Non-admin cannot get users
    const nonAdminResponse = await request('GET', '/users/', null, user1Token);
    assert(
        nonAdminResponse.status === 403,
        'GET /users - Non-admin should be rejected',
        403,
        nonAdminResponse.status
    );
    
    // Test 3: Get specific user (admin only)
    if (testUserId) {
        const getUserResponse = await request('GET', `/users/${testUserId}`, null, adminToken);
        assert(
            getUserResponse.status === 200,
            'GET /users/:id - Admin should get user by ID',
            200,
            getUserResponse.status
        );
    }
    
    // Test 4: Non-admin cannot get specific user
    if (testUserId) {
        const nonAdminUserResponse = await request('GET', `/users/${testUserId}`, null, user1Token);
        assert(
            nonAdminUserResponse.status === 403,
            'GET /users/:id - Non-admin should be rejected',
            403,
            nonAdminUserResponse.status
        );
    }
    
    // Test 5: Delete user (admin only) - We'll test this last
    if (testUserId) {
        const deleteResponse = await request('DELETE', `/users/${testUserId}`, null, adminToken);
        assert(
            deleteResponse.status === 200,
            'DELETE /users/:id - Admin should delete user',
            200,
            deleteResponse.status
        );
    }
}

async function testCleanup() {
    console.log(`\n${colors.cyan}=== Cleanup Test Resources ===${colors.reset}\n`);
    
    // Delete test card
    if (testCardId) {
        const deleteCardResponse = await request('DELETE', `/cards/${testCardId}`, null, user1Token);
        assert(
            deleteCardResponse.status === 200,
            'DELETE /cards/:id - Should delete card',
            200,
            deleteCardResponse.status
        );
    }
    
    // Delete test collection
    if (testCollectionId) {
        const deleteCollectionResponse = await request('DELETE', `/collections/${testCollectionId}`, null, user1Token);
        assert(
            deleteCollectionResponse.status === 200,
            'DELETE /collections/:id - Should delete collection',
            200,
            deleteCollectionResponse.status
        );
    }
}

// Main test runner
async function runTests() {
    console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║  Memory Card API - Automated Test Suite                   ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log(`${colors.gray}Testing API at: ${BASE_URL}${colors.reset}`);
    
    const startTime = Date.now();
    
    try {
        await testAuthEndpoints();
        await testCollectionEndpoints();
        await testCardEndpoints();
        await testReviewEndpoints();
        await testUserEndpoints();
        await testCleanup();
        
        const duration = Date.now() - startTime;
        
        console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.blue}Test Results${colors.reset}`);
        console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`Total Tests:  ${results.total}`);
        console.log(`${colors.green}Passed:       ${results.passed}${colors.reset}`);
        console.log(`${colors.red}Failed:       ${results.failed}${colors.reset}`);
        console.log(`Duration:     ${duration}ms`);
        console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);
        
        if (results.failed > 0) {
            console.log(`${colors.red}Failed Tests:${colors.reset}`);
            results.failures.forEach((failure, index) => {
                console.log(`${colors.red}${index + 1}. ${failure.test}${colors.reset}`);
            });
            console.log('');
            process.exit(1);
        } else {
            console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
            process.exit(0);
        }
    } catch (error) {
        console.error(`${colors.red}Test suite error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

// Check if server is running before starting tests
async function checkServer() {
    try {
        const response = await fetch(BASE_URL);
        return true;
    } catch (error) {
        console.error(`${colors.red}Error: Cannot connect to API server at ${BASE_URL}${colors.reset}`);
        console.error(`${colors.yellow}Please start the server first with: npm run dev${colors.reset}\n`);
        process.exit(1);
    }
}

// Entry point
checkServer().then(() => runTests());

import assert from 'assert';

const BASE_URL = 'http://localhost:5000';

async function testAuthSystem() {
  console.log('🏁 Starting API Authentication and Security verification tests...\n');

  const randomId = Math.floor(Math.random() * 1000000);
  const testEmail = `user_${randomId}@example.com`;
  const testPassword = 'SecurePassword123';
  const testName = 'Verification User';
  let token = null;

  try {
    // 1. Health Check
    console.log('Testing GET /health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'UP');
    console.log('✅ Health Check passed!');

    // 2. Register - Successful Creation
    console.log('\nTesting POST /api/auth/register (New User)...');
    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword })
    });
    assert.strictEqual(registerRes.status, 201);
    const registerData = await registerRes.json();
    assert.strictEqual(registerData.success, true);
    assert(registerData.user.id);
    assert.strictEqual(registerData.user.email, testEmail);
    assert.strictEqual(registerData.user.name, testName);
    assert.strictEqual(registerData.user.password, undefined, 'Plain password must never be returned');
    console.log('✅ Registration (201 Created) passed!');

    // 3. Register - Duplicate Email error (400)
    console.log('\nTesting POST /api/auth/register (Duplicate Email)...');
    const duplicateRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword })
    });
    assert.strictEqual(duplicateRes.status, 400);
    const duplicateData = await duplicateRes.json();
    assert.strictEqual(duplicateData.success, false);
    assert(duplicateData.message.includes('already exists'));
    console.log('✅ Duplicate registration rejected with 400 passed!');

    // 4. Login - Correct credentials
    console.log('\nTesting POST /api/auth/login (Correct Credentials)...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    assert(loginData.token, 'JWT must be returned on successful login');
    token = loginData.token;
    console.log('✅ Login (200 OK with token) passed!');

    // 5. Protected API - Access without token (401)
    console.log('\nTesting GET /api/reviews (Access Without Token)...');
    const unauthorizedRes = await fetch(`${BASE_URL}/api/reviews`);
    assert.strictEqual(unauthorizedRes.status, 401);
    const unauthorizedData = await unauthorizedRes.json();
    assert.strictEqual(unauthorizedData.success, false);
    console.log('✅ Protected endpoint blocked unauthorized access with 401 passed!');

    // 6. Protected API - Access with valid token (200)
    console.log('\nTesting GET /api/reviews (Access With Valid Token)...');
    const authorizedRes = await fetch(`${BASE_URL}/api/reviews`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(authorizedRes.status, 200);
    const reviewsList = await authorizedRes.json();
    assert(Array.isArray(reviewsList));
    console.log('✅ Protected endpoint allowed authorized access with 200 passed!');

    // 7. Rate Limiter check (429)
    console.log('\nTesting Authentication Rate Limiter (hitting /api/auth/login repeatedly)...');
    let rateLimited = false;
    // We already did 1 login request above. Let's make 6 more requests (total 7, limit is 5 per 15 mins)
    for (let i = 0; i < 6; i++) {
      const limitRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'wrong-password' })
      });
      if (limitRes.status === 429) {
        rateLimited = true;
        const limitData = await limitRes.json();
        assert.strictEqual(limitData.success, false);
        assert(limitData.message.includes('Too many'));
        console.log(`✅ Rate limiter triggered! Received 429 response on attempt ${i + 2}.`);
        break;
      }
    }
    assert(rateLimited, 'Rate limiter did not trigger 429 status after excessive authentication requests.');

    console.log('\n🎉 ALL AUTHENTICATION SYSTEM TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('\n❌ Verification Failed:', err.message);
    process.exit(1);
  }
}

testAuthSystem();

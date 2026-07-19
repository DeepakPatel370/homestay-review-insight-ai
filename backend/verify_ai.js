// Using built-in Node fetch

async function verifyAIEndpoint() {
  console.log('🧪 Testing Auth and AI Analyze Endpoint...');

  const email = `test_${Date.now()}@example.com`;
  const password = 'Password123!';

  // 1. Register
  console.log(`Registering user ${email}...`);
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Host',
      email,
      password
    })
  });
  const regData = await regRes.json();
  console.log('Register Response:', regData.message);

  // 2. Login to get JWT Token
  console.log('Logging in to get JWT token...');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('✅ Auth successful! Obtained JWT token.');

  // 3. Test POST /api/ai/analyze
  console.log('Dispatches POST /api/ai/analyze with sample payload...');
  const aiRes = await fetch('http://localhost:5000/api/ai/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      propertyName: 'Sunset Haven Villa',
      text: 'The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside.',
      tone: 'Professional'
    })
  });

  const status = aiRes.status;
  const aiData = await aiRes.json();

  console.log(`STATUS: ${status}`);
  console.log('RESPONSE PAYLOAD:', JSON.stringify(aiData, null, 2));

  if (status === 200 && aiData.success) {
    console.log('🎉 POST /api/ai/analyze endpoint test PASSED with flying colors!');
  } else {
    console.error('❌ Endpoint test failed!');
  }
}

verifyAIEndpoint();

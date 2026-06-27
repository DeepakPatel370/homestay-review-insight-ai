import assert from 'assert';

const BASE_URL = 'http://localhost:5000';

async function testEndpoints() {
  console.log('🏁 Starting API verification tests...\n');

  let testReviewId = null;

  try {
    // 1. Test Health Check
    console.log('Testing GET /health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'UP');
    console.log('✅ Health Check passed!');

    // 2. Test Get Reviews
    console.log('\nTesting GET /api/reviews...');
    const listRes = await fetch(`${BASE_URL}/api/reviews`);
    assert.strictEqual(listRes.status, 200);
    const reviews = await listRes.json();
    assert(Array.isArray(reviews));
    assert(reviews.length >= 3); // Preseeded count
    console.log(`✅ GET /api/reviews passed! Found ${reviews.length} reviews.`);

    // 3. Test Get Stats
    console.log('\nTesting GET /api/reviews/stats...');
    const statsRes = await fetch(`${BASE_URL}/api/reviews/stats`);
    assert.strictEqual(statsRes.status, 200);
    const stats = await statsRes.json();
    assert(stats.totalReviews !== undefined);
    assert(stats.avgRating !== undefined);
    assert(stats.sentimentIndex !== undefined);
    assert(stats.aiResponses !== undefined);
    console.log('✅ GET /api/reviews/stats passed!', JSON.stringify(stats));

    // 4. Test Create Review (POST)
    console.log('\nTesting POST /api/reviews...');
    const postRes = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyName: 'Ocean Breeze Inn',
        text: 'This place was wonderful! Close to the shore, very clean, but the keys were hard to find.'
      })
    });
    assert.strictEqual(postRes.status, 201);
    const newReview = await postRes.json();
    assert(newReview.id);
    assert.strictEqual(newReview.propertyName, 'Ocean Breeze Inn');
    assert.strictEqual(newReview.sentiment, 'mixed'); // Rule should detect "clean" and "but"
    testReviewId = newReview.id;
    console.log('✅ POST /api/reviews passed! Created review ID:', testReviewId);

    // 5. Test Get Single Review (GET /api/reviews/:id)
    console.log(`\nTesting GET /api/reviews/${testReviewId}...`);
    const singleRes = await fetch(`${BASE_URL}/api/reviews/${testReviewId}`);
    assert.strictEqual(singleRes.status, 200);
    const singleReview = await singleRes.json();
    assert.strictEqual(singleReview.id, testReviewId);
    console.log('✅ GET /api/reviews/:id passed!');

    // 6. Test Update Review (PUT /api/reviews/:id)
    console.log(`\nTesting PUT /api/reviews/${testReviewId}...`);
    const putRes = await fetch(`${BASE_URL}/api/reviews/${testReviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: 'Hi Guest, thank you for your review! We apologize for the key issue and have resolved it.',
        status: 'responded'
      })
    });
    assert.strictEqual(putRes.status, 200);
    const updatedReview = await putRes.json();
    assert.strictEqual(updatedReview.status, 'responded');
    assert(updatedReview.reply.includes('key issue'));
    console.log('✅ PUT /api/reviews/:id passed!');

    // 7. Test Search/Filter (GET /api/reviews?q=Ocean)
    console.log('\nTesting GET /api/reviews?q=Ocean...');
    const searchRes = await fetch(`${BASE_URL}/api/reviews?q=Ocean`);
    assert.strictEqual(searchRes.status, 200);
    const searchResults = await searchRes.json();
    assert(searchResults.length > 0);
    assert.strictEqual(searchResults[0].propertyName, 'Ocean Breeze Inn');
    console.log('✅ GET /api/reviews?q=... (Search/Filter) passed!');

    // 8. Test Sync Reviews (POST /api/reviews/sync)
    console.log('\nTesting POST /api/reviews/sync...');
    const syncRes = await fetch(`${BASE_URL}/api/reviews/sync`, { method: 'POST' });
    assert.strictEqual(syncRes.status, 200);
    const syncData = await syncRes.json();
    assert(syncData.success);
    assert(syncData.syncedCount > 0);
    console.log(`✅ POST /api/reviews/sync passed! Synced ${syncData.syncedCount} reviews.`);

    // 9. Test Delete Review (DELETE /api/reviews/:id)
    console.log(`\nTesting DELETE /api/reviews/${testReviewId}...`);
    const deleteRes = await fetch(`${BASE_URL}/api/reviews/${testReviewId}`, { method: 'DELETE' });
    assert.strictEqual(deleteRes.status, 204);
    
    // Confirm deletion
    const getDeletedRes = await fetch(`${BASE_URL}/api/reviews/${testReviewId}`);
    assert.strictEqual(getDeletedRes.status, 404);
    console.log('✅ DELETE /api/reviews/:id passed!');

    console.log('\n🎉 ALL ENDPOINTS VERIFIED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('\n❌ Verification Failed:', err.message);
    process.exit(1);
  }
}

testEndpoints();

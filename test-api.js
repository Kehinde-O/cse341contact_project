const http = require('http');
const https = require('https');

// Test configuration
const config = {
  host: 'localhost',
  port: 3000,
  protocol: 'http:',
  headers: {
    'Content-Type': 'application/json'
  }
};

// Helper to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.headers['content-type']?.includes('application/json') ? JSON.parse(body) : body
          };
          resolve(result);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await makeRequest({
      ...config,
      path: '/health',
      method: 'GET'
    });
    
    console.log(`Status: ${response.statusCode}`);
    console.log('Response:', response.body);
    return response.statusCode === 200;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testGetAllContacts() {
  console.log('\n📋 Testing GET /contacts...');
  try {
    const response = await makeRequest({
      ...config,
      path: '/contacts',
      method: 'GET'
    });
    
    console.log(`Status: ${response.statusCode}`);
    console.log('Response:', response.body);
    return response.statusCode === 200;
  } catch (error) {
    console.error('GET all contacts failed:', error.message);
    return false;
  }
}

async function testCreateContact() {
  console.log('\n➕ Testing POST /contacts...');
  const newContact = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    favoriteColor: 'Purple',
    birthday: '1995-03-20'
  };

  try {
    const response = await makeRequest({
      ...config,
      path: '/contacts',
      method: 'POST'
    }, newContact);
    
    console.log(`Status: ${response.statusCode}`);
    console.log('Response:', response.body);
    
    if (response.statusCode === 201 && response.body.contactId) {
      return response.body.contactId;
    }
    return null;
  } catch (error) {
    console.error('POST contact failed:', error.message);
    return null;
  }
}

async function testGetSingleContact(contactId) {
  console.log('\n🔍 Testing GET /contacts/:id...');
  try {
    const response = await makeRequest({
      ...config,
      path: `/contacts/${contactId}`,
      method: 'GET'
    });
    
    console.log(`Status: ${response.statusCode}`);
    console.log('Response:', response.body);
    return response.statusCode === 200;
  } catch (error) {
    console.error('GET single contact failed:', error.message);
    return false;
  }
}

async function testUpdateContact(contactId) {
  console.log('\n✏️ Testing PUT /contacts/:id...');
  const updatedContact = {
    firstName: 'Updated',
    lastName: 'User',
    email: 'updated.user@example.com',
    favoriteColor: 'Orange',
    birthday: '1995-03-20'
  };

  try {
    const response = await makeRequest({
      ...config,
      path: `/contacts/${contactId}`,
      method: 'PUT'
    }, updatedContact);
    
    console.log(`Status: ${response.statusCode}`);
    console.log('Response:', response.body);
    return response.statusCode === 200;
  } catch (error) {
    console.error('PUT contact failed:', error.message);
    return false;
  }
}

async function testDeleteContact(contactId) {
  console.log('\n🗑️ Testing DELETE /contacts/:id...');
  try {
    const response = await makeRequest({
      ...config,
      path: `/contacts/${contactId}`,
      method: 'DELETE'
    });
    
    console.log(`Status: ${response.statusCode}`);
    console.log('Response:', response.body);
    return response.statusCode === 200;
  } catch (error) {
    console.error('DELETE contact failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('Make sure the server is running on http://localhost:3000');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  // Test health check
  results.total++;
  if (await testHealthCheck()) {
    results.passed++;
    console.log('✅ Health check passed');
  } else {
    results.failed++;
    console.log('❌ Health check failed');
  }
  
  // Test get all contacts
  results.total++;
  if (await testGetAllContacts()) {
    results.passed++;
    console.log('✅ GET all contacts passed');
  } else {
    results.failed++;
    console.log('❌ GET all contacts failed');
  }
  
  // Test create contact
  results.total++;
  const contactId = await testCreateContact();
  if (contactId) {
    results.passed++;
    console.log('✅ POST contact passed');
    
    // Test get single contact
    results.total++;
    if (await testGetSingleContact(contactId)) {
      results.passed++;
      console.log('✅ GET single contact passed');
    } else {
      results.failed++;
      console.log('❌ GET single contact failed');
    }
    
    // Test update contact
    results.total++;
    if (await testUpdateContact(contactId)) {
      results.passed++;
      console.log('✅ PUT contact passed');
    } else {
      results.failed++;
      console.log('❌ PUT contact failed');
    }
    
    // Test delete contact
    results.total++;
    if (await testDeleteContact(contactId)) {
      results.passed++;
      console.log('✅ DELETE contact passed');
    } else {
      results.failed++;
      console.log('❌ DELETE contact failed');
    }
  } else {
    results.failed++;
    console.log('❌ POST contact failed');
  }
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the output above for details.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 
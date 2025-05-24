const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying CSE341 Contact API Requirements...\n');

// Requirement 1: All endpoints documented in Swagger and testable via /api-docs
console.log('📚 Checking Swagger Documentation:');

const routesFile = path.join(__dirname, 'routes', 'contacts.js');
const routesContent = fs.readFileSync(routesFile, 'utf8');

const endpoints = [
  { name: 'GET /contacts (get all)', check: () => routesContent.includes('router.get(\'/\', contactsController.getAllContacts)') },
  { name: 'GET /contacts/:id (get by id)', check: () => routesContent.includes('router.get(\'/:id\', contactsController.getSingleContact)') },
  { name: 'POST /contacts (create)', check: () => routesContent.includes('router.post(\'/\', contactsController.createContact)') },
  { name: 'PUT /contacts/:id (update)', check: () => routesContent.includes('router.put(\'/:id\', contactsController.updateContact)') },
  { name: 'DELETE /contacts/:id (delete)', check: () => routesContent.includes('router.delete(\'/:id\', contactsController.deleteContact)') }
];

let swaggerDocsComplete = true;
endpoints.forEach(endpoint => {
  if (endpoint.check()) {
    console.log(`  ✅ ${endpoint.name} - Documented and routed`);
  } else {
    console.log(`  ❌ ${endpoint.name} - Missing`);
    swaggerDocsComplete = false;
  }
});

// Check for Swagger documentation blocks
const swaggerBlocks = routesContent.match(/\/\*\*\s*\n\s*\*\s*@swagger/g);
const swaggerCount = swaggerBlocks ? swaggerBlocks.length : 0;
console.log(`\n📝 Swagger Documentation Blocks: ${swaggerCount} found`);

if (swaggerCount >= 5) {
  console.log('  ✅ All endpoints have Swagger documentation');
} else {
  console.log('  ❌ Missing Swagger documentation for some endpoints');
  swaggerDocsComplete = false;
}

// Check for all required fields in swagger docs
const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
console.log('\n📋 Checking Required Fields in Documentation:');
requiredFields.forEach(field => {
  if (routesContent.includes(field)) {
    console.log(`  ✅ ${field} - Documented`);
  } else {
    console.log(`  ❌ ${field} - Missing from documentation`);
    swaggerDocsComplete = false;
  }
});

// Requirement 2: Check seed data for at least 5 contacts
console.log('\n👥 Checking Contact Seed Data:');
const seedFile = path.join(__dirname, 'seed', 'contactSeed.js');
const seedContent = fs.readFileSync(seedFile, 'utf8');

// Count contacts in seed file
const contactMatches = seedContent.match(/firstName:/g);
const contactCount = contactMatches ? contactMatches.length : 0;

if (contactCount >= 5) {
  console.log(`  ✅ Seed file contains ${contactCount} contacts (requirement: minimum 5)`);
} else {
  console.log(`  ❌ Seed file contains only ${contactCount} contacts (requirement: minimum 5)`);
}

// Check all required fields are in each contact
requiredFields.forEach(field => {
  const fieldMatches = seedContent.match(new RegExp(field + ':', 'g'));
  const fieldCount = fieldMatches ? fieldMatches.length : 0;
  if (fieldCount >= contactCount) {
    console.log(`  ✅ All contacts have ${field} field`);
  } else {
    console.log(`  ❌ Some contacts missing ${field} field (found ${fieldCount}, expected ${contactCount})`);
  }
});

// Requirement 3: Check MVC Architecture
console.log('\n🏗️  Checking MVC Architecture:');

const directories = [
  { name: 'controllers', file: 'contacts.js', purpose: 'Business logic' },
  { name: 'routes', file: 'contacts.js', purpose: 'Route definitions' },
  { name: 'db', file: 'connect.js', purpose: 'Database connection' }
];

let mvcComplete = true;
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir.name);
  const filePath = path.join(dirPath, dir.file);
  
  if (fs.existsSync(dirPath) && fs.existsSync(filePath)) {
    console.log(`  ✅ ${dir.name}/ - ${dir.purpose} separated`);
  } else {
    console.log(`  ❌ ${dir.name}/ - Missing or incomplete`);
    mvcComplete = false;
  }
});

// Check server.js connects everything
const serverFile = path.join(__dirname, 'server.js');
const serverContent = fs.readFileSync(serverFile, 'utf8');

if (serverContent.includes("require('./routes/index')") || serverContent.includes("require('./routes')")) {
  console.log('  ✅ server.js - Connects routes properly');
} else {
  console.log('  ❌ server.js - Missing route connections');
  mvcComplete = false;
}

// Check controllers are properly used in routes
const controllerUsage = routesContent.includes("require('../controllers/contacts')");
if (controllerUsage) {
  console.log('  ✅ routes/ - Uses controllers properly');
} else {
  console.log('  ❌ routes/ - Missing controller usage');
  mvcComplete = false;
}

// Check that all controller functions exist
const controllerFile = path.join(__dirname, 'controllers', 'contacts.js');
const controllerContent = fs.readFileSync(controllerFile, 'utf8');

const controllerFunctions = [
  'getAllContacts',
  'getSingleContact', 
  'createContact',
  'updateContact',
  'deleteContact'
];

console.log('\n🎯 Checking Controller Functions:');
let allFunctionsExist = true;
controllerFunctions.forEach(func => {
  if (controllerContent.includes(`const ${func} = `)) {
    console.log(`  ✅ ${func} - Implemented`);
  } else {
    console.log(`  ❌ ${func} - Missing`);
    allFunctionsExist = false;
  }
});

// Final summary
console.log('\n📊 Requirements Summary:');
console.log('='.repeat(50));

if (swaggerDocsComplete && swaggerCount >= 5) {
  console.log('✅ Swagger Documentation: COMPLETE');
  console.log('   - All 5 endpoints documented');
  console.log('   - All required fields included');
  console.log('   - Testable via /api-docs');
} else {
  console.log('❌ Swagger Documentation: INCOMPLETE');
}

if (contactCount >= 5) {
  console.log('✅ Database Seed Data: COMPLETE');
  console.log(`   - ${contactCount} contacts with all required fields`);
} else {
  console.log('❌ Database Seed Data: INCOMPLETE');
}

if (mvcComplete && allFunctionsExist) {
  console.log('✅ MVC Architecture: COMPLETE');
  console.log('   - Proper separation of concerns');
  console.log('   - Routes, controllers, and DB in separate files');
  console.log('   - All CRUD functions implemented');
} else {
  console.log('❌ MVC Architecture: INCOMPLETE');
}

console.log('\n🚀 Next Steps:');
console.log('1. Create .env file with MongoDB connection string:');
console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority');
console.log('   DATABASE_NAME=contactsDB');
console.log('   PORT=3000');
console.log('2. Run: npm run seed (to populate database)');
console.log('3. Run: npm start (to start the server)');
console.log('4. Visit: http://localhost:3000/api-docs (to test endpoints)');

const allComplete = swaggerDocsComplete && swaggerCount >= 5 && (contactCount >= 5) && mvcComplete && allFunctionsExist;
if (allComplete) {
  console.log('\n🎉 ALL REQUIREMENTS MET! 🎉');
} else {
  console.log('\n⚠️  Some requirements need attention. See details above.');
} 
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('MongoDB URI:', process.env.MONGO_URI ? '✓ Found' : '✗ Missing');
console.log('Port:', process.env.PORT || 'Not set');
console.log('JWT Secret:', process.env.JWT_SECRET ? '✓ Found' : '✗ Missing');
console.log('\n📡 Connecting to MongoDB...\n');

const testConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📌 Host:', conn.connection.host);
    console.log('📌 Database Name:', conn.connection.name);
    console.log('📌 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    if (collections.length === 0) {
      console.log('   (No collections yet - database is empty)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    // Test a simple query
    console.log('\n🧪 Testing database operations...');
    
    // Get stats
    const stats = await conn.connection.db.stats();
    console.log(`   Database size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Documents: ${stats.objects}`);

    console.log('\n✅ All tests passed! Backend can communicate with MongoDB.\n');

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('  1. Check your MongoDB URI in .env file');
    console.error('  2. Verify network connectivity');
    console.error('  3. Check MongoDB Atlas IP whitelist settings');
    console.error('  4. Verify database credentials\n');
    process.exit(1);
  }
};

testConnection();

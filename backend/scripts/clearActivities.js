const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../src/config/db');
const Activity = require('../src/models/Activity');

(async () => {
  try {
    await connectDB();

    const result = await Activity.deleteMany({});
    console.log(`🗑️ ${result.deletedCount} activités supprimées`);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des activités :', error.message);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
})();

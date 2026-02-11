const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'cryptodata.db');
const db = new Database(dbPath);

try {
    console.log('Attempting to add password column...');
    // Check if column exists first to avoid error
    const tableInfo = db.pragma('table_info(users)');
    const hasPassword = tableInfo.some(col => col.name === 'password');

    if (!hasPassword) {
        db.exec('ALTER TABLE users ADD COLUMN password TEXT');
        console.log('Successfully added password column.');
    } else {
        console.log('Password column already exists.');
    }
} catch (error) {
    console.error('Migration failed:', error);
}

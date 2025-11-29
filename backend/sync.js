const db = require('./firebase');
const { sql, config } = require('./db');

async function syncUsers() {
  let pool;
  try {
    console.log('⏳ Connecting to SQL...');
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server');

    console.log('⏳ Fetching users from Firebase...');
    const snapshot = await db.collection('users').get();
    console.log(`✅ Fetched ${snapshot.size} user(s) from Firebase`);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userId = doc.id;
      const { name, email, role } = data;

      await pool.request()
        .input('firebaseId', sql.NVarChar, userId)
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .input('role', sql.NVarChar, role)
        .query(`
          MERGE INTO Users AS target
          USING (SELECT @firebaseId AS FirebaseId) AS source
          ON target.FirebaseId = source.FirebaseId
          WHEN MATCHED THEN
            UPDATE SET Name = @name, Email = @email, Role = @role
          WHEN NOT MATCHED THEN
            INSERT (FirebaseId, Name, Email, Role)
            VALUES (@firebaseId, @name, @email, @role);
        `);
    }

    console.log('✅ All users synced to SQL Server');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
    console.error(err); // Full stack trace
  } finally {
    if (pool) {
      pool.close(); // Close the pool if it was created
    }
  }
}

module.exports = { syncUsers };

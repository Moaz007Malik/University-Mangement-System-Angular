const db = require('./firebase');
const { sql, config } = require('./db');

async function syncUsers() {
  const pool = await sql.connect(config);
  const snapshot = await db.collection('users').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const userId = doc.id;
    const name = data.USER_NAME;
    const email = data.USER_EMAIL;
    const role = data.USER_TYPE;

    console.log(`📦 Syncing user: ${name} (${email}) [${role}]`);

    await pool.request()
      .input('id', sql.NVarChar, userId)
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
      INSERT (Id, FirebaseId, Name, Email, Role)
      VALUES (@id, @firebaseId, @name, @email, @role);
  `);

  }

  console.log('✅ Synced users to SQL Server');
}

module.exports = { syncUsers };

const db = require('./firebase');
const { sql, config } = require('./db');

async function syncCourses() {
  const pool = await sql.connect(config);
  const snapshot = await db.collection('courses').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const firebaseId = doc.id;
    const name = data.COURSE_NAME;
    const code = data.COURSE_CODE;
    const description = data.COURSE_DESC;

    await pool.request()
      .input('firebaseId', sql.NVarChar, firebaseId)
      .input('name', sql.NVarChar, name)
      .input('code', sql.NVarChar, code)
      .input('description', sql.NVarChar, description)
      .query(`
        MERGE INTO Courses AS target
        USING (SELECT @firebaseId AS FirebaseId) AS source
        ON target.FirebaseId = source.FirebaseId
        WHEN MATCHED THEN
          UPDATE SET Name = @name, Code = @code, Description = @description
        WHEN NOT MATCHED THEN
          INSERT (FirebaseId, Name, Code, Description)
          VALUES (@firebaseId, @name, @code, @description);
      `);
  }

  console.log('✅ Synced courses to SQL Server');
}

module.exports = { syncCourses };

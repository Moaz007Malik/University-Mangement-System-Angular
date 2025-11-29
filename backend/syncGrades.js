const db = require('./firebase');
const { sql, config } = require('./db');

async function syncGrades() {
  console.log('⏳ Syncing grades...');
  const pool = await sql.connect(config);
  const snapshot = await db.collection('grades').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const { studentId, courseId, title, date, marks, type } = data;

    await pool.request()
      .input('id', sql.NVarChar, doc.id)
      .input('studentId', sql.NVarChar, studentId || '')
      .input('courseId', sql.NVarChar, courseId || '')
      .input('type', sql.NVarChar, type || '')
      .input('title', sql.NVarChar, title || '')
      .input('marks', sql.Float, marks || 0)
      .input('date', sql.DateTime, date ? new Date(date) : new Date())
      .query(`
        MERGE INTO Grades AS target
        USING (SELECT @id AS id) AS source
        ON target.id = source.id
        WHEN MATCHED THEN
          UPDATE SET 
            StudentId = @studentId, 
            CourseId = @courseId, 
            title = @title, 
            type = @type,
            date = @date,
            Marks = @marks
        WHEN NOT MATCHED THEN
          INSERT (id, StudentId, CourseId, Title, Type, date, Marks)
          VALUES (@id, @studentId, @courseId, @title, @type, @date, @marks);
      `);
  }

  console.log(`✅ Synced ${snapshot.size} grade(s)`);
}

module.exports = { syncGrades };

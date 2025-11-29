const db = require('./firebase'); // your Firestore instance
const { sql, config } = require('./db'); // your MSSQL setup
const { v4: uuidv4 } = require('uuid');

async function syncEnrollments() {
  console.log("⏳ Syncing enrollments...");
  const pool = await sql.connect(config);
  const snapshot = await db.collection('courses').get();

  let count = 0;

  for (const doc of snapshot.docs) {
    const courseData = doc.data();
    const courseId = doc.id;

    const students = courseData.COURSE_STUDENTS || [];

    for (const entry of students) {
      const studentId = entry.studentId;
      const enrollmentId = uuidv4();

      await pool.request()
        .input('id', sql.UniqueIdentifier, enrollmentId)
        .input('courseId', sql.NVarChar, courseId)
        .input('studentId', sql.NVarChar, studentId)
        .query(`
          IF NOT EXISTS (
            SELECT 1 FROM Enrollments WHERE CourseId = @courseId AND StudentId = @studentId
          )
          BEGIN
            INSERT INTO Enrollments (Id, CourseId, StudentId)
            VALUES (@id, @courseId, @studentId)
          END
        `);

      count++;
    }
  }

  console.log(`✅ Synced ${count} enrollments`);
}

module.exports = { syncEnrollments };

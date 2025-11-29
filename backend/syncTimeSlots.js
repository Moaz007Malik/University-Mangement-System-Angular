const db = require('./firebase');
const { sql, config } = require('./db');

async function syncTimeSlots() {
  console.log('⏳ Syncing timeslots...');
  const pool = await sql.connect(config);
  const snapshot = await db.collection('timeslots').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const { courseId, teacherId, studentId, dayOfWeek, startTime, endTime } = data;

    await pool.request()
      .input('firebaseId', sql.NVarChar, doc.id)
      .input('courseId', sql.NVarChar, courseId || '')
      .input('teacherId', sql.NVarChar, teacherId || '')
      .input('studentId', sql.NVarChar, studentId || '')
      .input('dayOfWeek', sql.NVarChar, dayOfWeek || '')
      .input('startTime', sql.Time, startTime || '00:00:00')
      .input('endTime', sql.Time, endTime || '00:00:00')
      .query(`
        MERGE INTO TimeSlots AS target
        USING (SELECT @firebaseId AS FirebaseId) AS source
        ON target.FirebaseId = source.FirebaseId
        WHEN MATCHED THEN
          UPDATE SET CourseId = @courseId, TeacherId = @teacherId, StudentId = @studentId, DayOfWeek = @dayOfWeek, StartTime = @startTime, EndTime = @endTime
        WHEN NOT MATCHED THEN
          INSERT (FirebaseId, CourseId, TeacherId, StudentId, DayOfWeek, StartTime, EndTime)
          VALUES (@firebaseId, @courseId, @teacherId, @studentId, @dayOfWeek, @startTime, @endTime);
      `);
  }

  console.log(`✅ Synced ${snapshot.size} timeslot(s)`);
}

module.exports = { syncTimeSlots };
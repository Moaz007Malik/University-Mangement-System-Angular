const db = require('./firebase');
const { sql, config } = require('./db');

async function syncQuizzes() {
    console.log('⏳ Syncing quizzes...');
    const pool = await sql.connect(config);
    const snapshot = await db.collection('quizzes').get();

    for (const doc of snapshot.docs) {
        const data = doc.data();

        const firebaseId = doc.id;
        const courseId = data.courseId || '';
        const title = data.title || '';
        const description = data.description || '';
        const teacherId = data.teacherId || '';
        const type = data.type || '';

        let dueDate = new Date();
        if (typeof data.dueDate === 'string') {
            const parsed = new Date(data.dueDate);
            if (!isNaN(parsed.getTime())) {
                dueDate = parsed;
            }
        }

        const isEmailSent = typeof data.isEmailSent === 'boolean' ? data.isEmailSent : false;

        await pool.request()
            .input('firebaseId', sql.NVarChar, firebaseId)
            .input('courseId', sql.NVarChar, courseId)
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description)
            .input('dueDate', sql.DateTime, dueDate)
            .input('teacherId', sql.NVarChar, teacherId)
            .input('type', sql.NVarChar, type)
            .input('isEmailSent', sql.Bit, isEmailSent)
            .query(`
            MERGE INTO Quizzes AS target
USING (SELECT @firebaseId AS FirebaseId) AS source
ON target.FirebaseId = source.FirebaseId
WHEN MATCHED THEN
  UPDATE SET 
    CourseId = @courseId, 
    Title = @title, 
    Description = @description,
    DueDate = @dueDate,
    TeacherId = @teacherId,
    Type = @type
WHEN NOT MATCHED THEN
  INSERT (FirebaseId, CourseId, Title, Description, DueDate, TeacherId, Type, IsEmailSent)
  VALUES (@firebaseId, @courseId, @title, @description, @dueDate, @teacherId, @type, @isEmailSent);

        `);
    }


    console.log('✅ Synced quizzes');
}

module.exports = { syncQuizzes };

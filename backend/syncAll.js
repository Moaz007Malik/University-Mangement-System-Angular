const { syncUsers } = require('./syncUsers');
const { syncCourses } = require('./syncCourses');
const { syncGrades } = require('./syncGrades');
const { syncQuizzes } = require('./syncQuizzes');
const { syncTimeSlots } = require('./syncTimeSlots');
const { syncEnrollments } = require('./syncEnrollments');

async function syncAll() {
  console.log("🚀 Starting full Firebase → SQL sync...");

  try {
    await syncUsers();
    await syncCourses();
    await syncGrades();
    await syncQuizzes();
    await syncTimeSlots();
    await syncEnrollments();

    console.log("✅ All data synced successfully to SQL Server");
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
    throw error;
  }
}

module.exports = { syncAll };

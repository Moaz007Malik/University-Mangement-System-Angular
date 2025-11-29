const express = require('express');
const app = express();
const PORT = 3000;

const { syncAll } = require('./syncAll');

app.get('/sync-all', async (req, res) => {
  try {
    await syncAll();
    res.send('✅ All data synced successfully from Firebase to SQL Server.');
  } catch (err) {
    res.status(500).send('❌ Sync failed: ' + err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // 🕖 Auto-sync every 7 seconds
  setInterval(async () => {
    try {
      console.log('\n⏳ Auto-sync triggered...');
      await syncAll();
    } catch (err) {
      console.error('❌ Auto-sync failed:', err.message);
    }
  }, 7000); // 7000 milliseconds = 7 seconds
});

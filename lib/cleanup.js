let _dbo = null;

function getDbo() {
  if (!_dbo) {
    _dbo = global.db;
  }
  return _dbo;
}

// Function to delete old stories
const deleteOldStories = async () => {
  try {
    const query = `
        DELETE FROM posts
        WHERE story = TRUE
        AND date < NOW() - INTERVAL '24 hours';
      `;

    const res = await getDbo().run(query);
    console.log(`Deleted ${res} stories older than 24 hours`);
  } catch (err) {
    console.error("Error deleting old stories:", err);
  }
};

module.exports = deleteOldStories;

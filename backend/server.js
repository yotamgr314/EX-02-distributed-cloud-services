const app = require("./app");

// ✅ קביעת פורט מהסביבה או ברירת מחדל ל-5000
const PORT = process.env.PORT || 5000;

// ✅ הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

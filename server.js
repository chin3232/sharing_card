const express = require("express");

const cors = require("cors");

const db = require("./database");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

// app.get("/songs", (req, res) => {
//   db.query(
//     "SELECT * FROM songs",

//     (err, result) => {
//       res.json(result);
//     },
//   );
// });
app.get("/songs", (req, res) => {
  db.query(
    "SELECT * FROM songs ORDER BY id DESC",
    (err, result) => {
      res.json(result);
    }
  );
});

app.post("/songs", (req, res) => {
  const { song_name, emoji, description, category } = req.body;

  db.query(
    "INSERT INTO songs (song_name, emoji, description, category) VALUES(?,?,?,?)",
    [song_name, emoji, description, category],
    (err, result) => {
      // เพิ่มการเช็ค Error ตรงนี้
      if (err) {
        console.error("❌ Database Error:", err); // แสดง Error ใน Log ของ Render
        return res.status(500).json({ error: err.message }); // แจ้งกลับไปว่าพัง
      }
      
      res.json("ok"); // ถ้าไม่มี Error ถึงจะตอบ ok
    }
  );
});

app.use("/img", express.static("img"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/sharing-card", (req, res) => {
  res.sendFile(__dirname + "/public/phone.html");
});


app.listen(PORT, () => {
  console.log("Server run", PORT);
});

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
  const {
    // song,

    // emoji,

    // desc,
    song_name,
    emoji,
    description,
    category
  } = req.body;

  db.query(
    "INSERT INTO songs (song_name, emoji, description, category) VALUES(?,?,?,?)",

    [song_name, emoji, description, category],

    (err, result) => {
      res.json("ok");
    },
  );
});

app.use("/img", express.static("img"));

app.listen(3000, () => {
  console.log("Server run 3000");
});

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Video Platform API Running"
  });
});

app.get("/api/blogs", (req, res) => {
  const blogs = JSON.parse(
    fs.readFileSync("./blogs.json", "utf8")
  );

  res.json(blogs);
});

app.get("/api/videos", (req, res) => {
  const videos = JSON.parse(
    fs.readFileSync("./videos.json", "utf8")
  );

  const data = videos.map(video => ({
    ...video,
    playUrl: `/video/${video.file}`,
    downloadUrl: `/download/${video.file}`
  }));

  res.json(data);
});

app.get("/video/:file", (req, res) => {

  const filePath = path.join(
    __dirname,
    "videos",
    req.params.file
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Video not found");
  }

  res.sendFile(filePath);
});

app.get("/download/:file", (req, res) => {

  const filePath = path.join(
    __dirname,
    "videos",
    req.params.file
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Video not found");
  }

  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

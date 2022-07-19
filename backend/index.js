const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");


dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/backend/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
  });

  app.use("/backend/auth", authRoute);
  app.use("/backend/users", userRoute);
  app.use("/backend/posts", postRoute);
  app.use("/backend/categories", categoryRoute);
  
  app.use(express.static(path.join(__dirname, "/frontend/build")))

  app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
  });

  app.listen(process.env.PORT || 4000, () => {
    console.log(`Backend is running on 4000`);
  });

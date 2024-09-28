import express from "express";
import cors from "cors";
import fs from 'fs';

import router from "./routes/routes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// To handle CORS Errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Browsers usually send this before PUT or POST Requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }

  // Continue Route Processing
  next();
});

app.use('/', router);

/**
 * IMAGE HANDLING
 */
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

app.use('/uploads', express.static('uploads'));

app.get('/img/:filename', function (req, res) {
  const fileName = req.params.filename;
  const filePath = `./uploads/${fileName}`;
  
  // Check if file exists
  res.sendFile(filePath, { root: '.' }, function (err) {
    if (err) {
      console.error(err);
      res.status(404).send('Image not found');
    }
  });
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Limit to 2MB
});

app.post('/img', upload.single('img'), function (req, res, next) {

  return res.status(200).json(req.file);
})

// Check if the directory exists, if not, create it
const uploadsDir = './uploads';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Directory ${uploadsDir} created.`);
} else {
  // console.log(`Directory ${uploadsDir} already exists.`);
}


export default app;
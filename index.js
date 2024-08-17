const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
require('./database/mongo');

// Cấu hình multer để lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Khởi tạo ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

// Khởi tạo Express app
const app = express();

// Cấu hình CORS
app.use(cors());

// Endpoint để tải ảnh lên
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const fileUrl = `${req.file.filename}`;
  res.json({ fileUrl });
});

// Cung cấp thư mục uploads để có thể truy cập ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cài đặt ApolloServer middleware
server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server sẵn sàng tại http://localhost:4000${server.graphqlPath}`)  );
});

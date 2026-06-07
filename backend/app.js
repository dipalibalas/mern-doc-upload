const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connect = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const uploadDocRoutes = require("./routes/uploadDocRoutes")
connect();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/upload", uploadDocRoutes);

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
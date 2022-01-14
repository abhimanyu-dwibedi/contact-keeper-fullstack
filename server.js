const express = require("express");
const connectDB = require("./config/db");
const connnectDb = require("./config/db");
const app = express();

// connnect db
connectDB();

// init middle ware
app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

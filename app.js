const express = require("express");
const mrzRoutes = require("./routes/mrzRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Routes MRZ
app.use("/api", mrzRoutes);

app.listen(PORT, () => {
  console.log(`App run on http://localhost:${PORT}`);
});

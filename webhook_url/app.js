const express = require("express")
const router = require("./routes/index")
const cors = require("cors")

const app = express()
const PORT = 3003

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", router)

//connect
app.listen(PORT, () => {
  console.log("webhook server running on port " + PORT);
})

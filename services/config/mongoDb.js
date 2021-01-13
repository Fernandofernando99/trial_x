const mongoose = require("mongoose")

const MongoDbConnect = async () => {
  try {
    const databaseUrl = "mongodb://localhost:27017/xendit-trial" //can be adjusted to your personal port setting
    const connect = await mongoose.connect(databaseUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1)
  }
}

module.exports = MongoDbConnect


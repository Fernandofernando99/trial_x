const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const BusinessSettingsSchema = new Schema({
  business_id: {
    type: String,
    required: [true, "business_id is required"]
  },
  webhook_url: {
    type: String,
    required: [true, "webhook_url is required"]
  }
}, {
  timestamps: true
})

const BusinessSettings = mongoose.model("BusinessSettings", BusinessSettingsSchema);

module.exports = BusinessSettings
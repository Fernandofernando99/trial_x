const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  business_id: {
    type: String,
    required: [true, "business_id is required"]
  },
  status: {
    type: String,
    required: [true, "status is required"]
  },
  retry_count: {
    type: Number,
    required: [true, "retry_count is required"]
  },
  payload: {
    type: Object,
    required: [true, "payload is required"],
    default: "0"
  }
}, {
  timestamps: true
})

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification
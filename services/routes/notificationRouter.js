const notificationRouter = require("express").Router()
const NotificationController = require("../controllers/NotificationController")

notificationRouter.post("/", NotificationController.addNewNotification)
notificationRouter.get("/", NotificationController.findAll)

module.exports = notificationRouter
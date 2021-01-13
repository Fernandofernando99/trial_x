const router = require('express').Router()
const businessSettingsRouter = require("./businessSettingsRouter")
const notificationRouter = require("./notificationRouter")

router.get('/', (req, res) => {
  res.status(200).json({
    msg: "Hello World!"
  })
})
router.use("/business_settings", businessSettingsRouter)
router.use("/notifications", notificationRouter)

module.exports = router
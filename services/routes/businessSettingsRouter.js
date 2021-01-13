const businessSettingsRouter = require("express").Router()
const BusinessSettingController = require("../controllers/BusinessSettingsController")
const BusinessSettings = require("../models/BusinessSetting")

businessSettingsRouter.get("/", BusinessSettingController.findOne)
businessSettingsRouter.post("/:id/test", BusinessSettingController.webHookTest)
businessSettingsRouter.post("/", BusinessSettingController.addOrUpdate)
businessSettingsRouter.delete("/:id", BusinessSettingController.deleteSetting)

module.exports = businessSettingsRouter
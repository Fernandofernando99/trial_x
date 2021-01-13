const BusinessSetting = require("../models/BusinessSetting");
const axios = require("axios");
const BusinessSettings = require("../models/BusinessSetting");

class BusinessSettingController {
  
  static findOne (req, res) {
    const { business_id } = req.headers
    BusinessSetting.findOne({ $or: [{ business_id }]})
      .then(setting => {
        if (!setting) {
          throw {message: "Business settings not found", statusCode: 404}
        } else {
          res.status(200).json(setting)
        }
      })
      .catch(err => {
        res.status(err.statusCode || 500).json({error: err.message || "Internal server error"})
      })
  }

  static addOrUpdate (req, res) {
    const { business_id, webhook_url } = req.body
    const businessSettingsObj = {
      business_id: business_id,
      webhook_url: webhook_url
    }
    let settingFromUpdate = ''
    BusinessSetting.findOneAndUpdate({ $or: [{ business_id }]}, businessSettingsObj, {useFindAndModify: false, new: true})
      .then(updatedSetting => {
        if (!updatedSetting) {
          return BusinessSetting.create(businessSettingsObj)
        } else {
          settingFromUpdate = updatedSetting
        }
      })
      .then(setting => {
        if (settingFromUpdate === "") {
          res.status(201).json(setting)
        } else {
          res.status(200).json(settingFromUpdate)
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static deleteSetting (req, res) {
    BusinessSetting.findByIdAndDelete(req.params.id)
      .then(setting => {
        if (!setting) {
          throw {message: "Business Setting Not Found", statusCode: 404}
        } else {
          res.status(200).json({success: true, message: `business settings for business_id: ${setting.business_id} has been cleared`})
        }
      })
      .catch(err => {
        res.status(err.statusCode || 500).json({Error: err.message || err})
      })
  }

  static webHookTest (req, res) {
    BusinessSetting.findOne({_id: req.params.id})
      .then(setting => {
        return axios({
          url: setting.webhook_url,
          method: "POST"
        })
      })
      .then(response => {
        if (response.status === 200) {
          res.status(200).json({success: true, status_code: response.status})
        } else {
          throw {statusCode: response.status}
        }
      })
      .catch(err => {
        res.status(500).json({success: false, status_code: err.statusCode || 500})
      })
  }

}

module.exports = BusinessSettingController
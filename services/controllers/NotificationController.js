const Notification = require("../models/Notification")
const BusinessSetting = require("../models/BusinessSetting");
const axios = require("axios");
// const axiosRetry = require("axios-retry");

// axios.interceptors.request.use(
//   config => {
//     console.log("connection to" + config.url);
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

// axios.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     if (error.response.status === 500) {
//       console.log("TEST");
//       return axios.request(error.config)
//     }
//     return Promise.reject(error)
//   }
// )

class NotificationController {
  static findAll (req, res) {
    Notification.find({business_id: req.headers.business_id})
      .then(settings => {
        if (settings.length > 0) {
          res.status(200).json(settings)
        } else {
          res.status(200).json({message: "your business had no notification record"})
        }
      })
      .catch(err => res.status(500).json(err))
  }

  static addNewNotification (req, res) {
    const { payment_id, business_id, amount, created } = req.body
    try {
      if (!payment_id || !business_id || !amount || !created) {
        throw {message: "Bad request", statusCode: 400}
      } else {
        let payload = {
          payment_id: payment_id,
          amount: amount,
          created: created
        }
        const notificationObj = {
          business_id: business_id,
          status: "pending",
          retry_count: 0,
          payload: payload
        }
        let notificationId = ''
        Notification.create(notificationObj)
        .then(notification => {
          notificationId = notification._id
          return BusinessSetting.findOne({$or: [{business_id: notification.business_id}]})
        })
        .then( (setting) => {
          return axios({
            method: "POST",
            url: setting.webhook_url,
            data: setting.payload
          })
        })
        .then(response => {
          if (response.status === 200) {
            return Notification.findOneAndUpdate({_id: notificationId}, {...notificationObj, status: "sent"}, {new: true, useFindAndModify: false})
          } else {
            throw {message: "cannot send the notification", statusCode: response.status}
          }
        })
        .then(updatedData => {
          res.status(202).json(updatedData)
        })
        .catch(err => {
          res.status(err.statusCode || 500).json({Error: err.message || error})    
        })
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({Error: error.message || error})
    }
  }
}

module.exports = NotificationController
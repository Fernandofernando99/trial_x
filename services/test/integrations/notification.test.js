const request = require("supertest")
const app = require("../../app.js")
const BusinessSetting = require("../../models/BusinessSetting");
const Notification = require("../../models/Notification");

let notification_test_settings = {
  business_id: "1234",
  webhook_url: "http://localhost:3003",
  created: new Date(),
  updated: new Date()
}
let test_payload = {
  payment_id: "123",
  amount: 20000,
  created: new Date(),
  business_id: "1234"
}
let business_settings_created = ''


beforeAll((done) => {
  BusinessSetting.create(notification_test_settings)
    .then(setting => {
      business_settings_created = setting
      done()
    })
    .catch(err => {
      done(err)
    })
})

afterAll((done) => {
  BusinessSetting.deleteOne({_id: business_settings_created._id})
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
})

describe("Create Notification - Success Case", () => {
  test("should send an object with keys: id, business_id, createdAt, updatedAt, status, retry_count, payload", (done) => {
    request(app)
      .post("/notifications")
      .send(test_payload)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(202);
        expect(res.body).toHaveProperty("_id", expect.any(String))
        expect(res.body).toHaveProperty("business_id", test_payload.business_id)
        expect(res.body).toHaveProperty("status", expect.any(String))
        expect(res.body).toHaveProperty("createdAt", expect.any(String))
        expect(res.body).toHaveProperty("updatedAt", expect.any(String))
        done()
      })
  })
})

describe("Create Notification - Failed Case", () => {
  test("should send an bad request error message when amount is not inputted ", (done) => {
    request(app)
      .post("/notifications")
      .send({
        payment_id: "123",
        created: new Date(),
        business_id: "1234"
      })
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("Error", "Bad request")
        done()
      })
  })

  test("should send an error message when url cannot be connected ", (done) => {
    request(app)
      .post("/notifications")
      .send({
        payment_id: "123",
        created: new Date(),
        business_id: "testing123",
        amount: 10005
      })
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("Error", expect.any(String))
        done()
      })
  })

  test("should send an bad request error message when payment_id is not inputted ", (done) => {
    request(app)
      .post("/notifications")
      .send({
        created: new Date(),
        business_id: "1234",
        amount: 1005
      })
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("Error", "Bad request")
        done()
      })
  })

  test("should send an bad request error message when business_id is not inputted ", (done) => {
    request(app)
      .post("/notifications")
      .send({
        payment_id: "123",
        created: new Date(),
        amount: 1005
      })
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("Error", "Bad request")
        done()
      })
  })
})

describe("Find All Notification - Success Case", () => {
  test("should send an array of notification object", (done) => {
    request(app)
      .get("/notifications")
      .set("business_id",test_payload.business_id)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Array))
        done()
      })
  })
  
})

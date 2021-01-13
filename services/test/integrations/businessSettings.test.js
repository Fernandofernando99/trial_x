const request = require("supertest")
const app = require("../../app.js")
const BusinessSetting = require("../../models/BusinessSetting");

let test_settings = {
  business_id: "testing_only",
  webhook_url: "http://localhost:3003"
}
let business_settings_created = ""

describe("Create Business Settings - Success Case", () => {
  test("should send an object with keys: id, business_id, webhook_url, createdAt, updatedAt with status code 201", (done) => {
    request(app)
      .post("/business_settings")
      .send(test_settings)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id", expect.any(String))
        expect(res.body).toHaveProperty("business_id", test_settings.business_id)
        expect(res.body).toHaveProperty("webhook_url", test_settings.webhook_url)
        expect(res.body).toHaveProperty("createdAt", expect.any(String))
        expect(res.body).toHaveProperty("updatedAt", expect.any(String))
        business_settings_created = res.body
        done()
      })
  })
})

describe("Create Business Settings - Failed Case", () => {
  test("should return error object with business_id as the key informing that business_id is required", (done) => {
    request(app)
      .post("/business_settings")
      .send({webhook_url: "http://localhost:3003"})
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(500);
        expect(res.body.errors.business_id).toHaveProperty("message", "business_id is required")
        done()
      })
  })
  test("should return error object with webhook_url as the key informing that webhook_url is required ", (done) => {
    request(app)
      .post("/business_settings")
      .send({business_id: "test444"})
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(500);
        expect(res.body.errors.webhook_url).toHaveProperty("message", "webhook_url is required")
        done()
      })
  })
})

describe("Update Business Settings - Success Case", () => {
  test("should send an object with keys: id, business_id, webhook_url, createdAt, updatedAt with status code 200", (done) => {
    request(app)
      .post("/business_settings")
      .send(test_settings)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", expect.any(String))
        expect(res.body).toHaveProperty("business_id", test_settings.business_id)
        expect(res.body).toHaveProperty("webhook_url", test_settings.webhook_url)
        expect(res.body).toHaveProperty("createdAt", expect.any(String))
        expect(res.body).toHaveProperty("updatedAt", expect.any(String))
        done()
      })
  })
})

describe("Update Business Settings - Failed Case", () => {
  test("should return error object with business_id as the key informing that business_id is required ", (done) => {
    request(app)
      .post("/business_settings")
      .send({webhook_url: test_settings.webhook_url})
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(500);
        expect(res.body.errors.business_id).toHaveProperty("message", "business_id is required")
        done()
      })
  })
})

describe("Show Business Settings - Success Case", () => {
  test("should send an object with keys: id, business_id, webhook_url, createdAt, updatedAt", (done) => {
    request(app)
      .get("/business_settings")
      .set("business_id", test_settings.business_id)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object))
        done()
      })
  })
})


describe("Webhook url test - Success Case", () => {
  test("should send an object with keys: success and true as its value, status_code", (done) => {
    request(app)
      .post(`/business_settings/${business_settings_created._id}/test`)
      .send(test_settings)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true)
        expect(res.body).toHaveProperty("status_code", 200)
        done()
      })
  })
})

describe("Webhook url test - Failed Case", () => {
  test("should send an object with keys: success and false as its value, status_code", (done) => {
    request(app)
      .post(`/business_settings/${business_settings_created._id}99/test`)
      .send(test_settings)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("success", false)
        expect(res.body).toHaveProperty("status_code", 500)
        done()
      })
  })
})

describe("Delete Business Settings - Success Case", () => {
  test("should send an object with keys: success, message", (done) => {
    request(app)
      .delete(`/business_settings/${business_settings_created._id}`)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true)
        expect(res.body).toHaveProperty("message", expect.any(String))
        done()
      })
  })
})

describe("Show Business Settings - Failed Case", () => {
  test("should send a not found error message", (done) => {
    request(app)
      .get("/business_settings")
      .set("business_id", test_settings.business_id)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Business settings not found")
        done()
      })
  })
})

describe("Delete Business Settings - Failed Case", () => {
  test("should send an error when id is invalid", (done) => {
    request(app)
      .delete(`/business_settings/${business_settings_created._id}00`)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("Error", expect.any(String))
        done()
      })
  })
})

describe("Delete Business Settings - Failed Case", () => {
  test("should send an error when id is not found", (done) => {
    request(app)
      .delete(`/business_settings/${business_settings_created._id}`)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("Error", "Business Setting Not Found")
        done()
      })
  })
})
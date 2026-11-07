const express = require("express");
const customer = require("../../controllers/sales_management/customer");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/customer/next_number", auth.authCheck, customer.getNextNumber);

router.get("/all_customers", auth.authCheck, customer.getAllCustomers);

router.post("/delete_customer", auth.authCheck, customer.deleteCustomers);

router
  .route("/customer")
  .post(auth.authCheck, customer.createCustomer)
  .get(auth.authCheck, customer.listCustomers);

router
  .route("/customer/:id")
  .get(auth.authCheck, customer.detailCustomer)
  .put(auth.authCheck, customer.updateCustomer);

module.exports = router;

const express = require("express");
const lead = require("../../controllers/sales_management/lead");
const validation = require("../../middlewares/sales_management/leadValidator");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/lead/next_number", auth.authCheck, lead.getNextNumber);

router
  .route("/quotation-enquiry")
  .post(auth.validateAPI, validation.enquiry, lead.enquiry);

router.post("/delete_lead", auth.authCheck, lead.deleteLeads);

router
  .route("/lead")
  .get(auth.authCheck, lead.listLeads)
  .post(auth.authCheck, validation.create, lead.createLead);

router
  .route("/lead/:id")
  .get(auth.authCheck, lead.detailLead)
  .put(auth.authCheck, lead.updateLead);

module.exports = router;

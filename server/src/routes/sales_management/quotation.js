const express = require("express");
const quotation = require("../../controllers/sales_management/quotation");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/quotation/next_number", auth.authCheck, quotation.getNextNumber);

router.get(
  "/pdf_data/quotation/:id",
  auth.validateAPI,
  quotation.detailQuotation
);

router.post("/delete_quotation", auth.authCheck, quotation.deleteQuotations);

router
  .route("/quotation")
  .post(auth.authCheck, quotation.createQuotation)
  .get(auth.authCheck, quotation.listQuotations);

router
  .route("/quotation/:id")
  .get(auth.authCheck, quotation.detailQuotation)
  .put(auth.authCheck, quotation.updateQuotation);

router
  .route("/download_quotation/:id")
  .get(auth.authCheck, quotation.downloadQuotation);

module.exports = router;

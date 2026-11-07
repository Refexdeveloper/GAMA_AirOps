const express = require("express");
const quotation = require("../../controllers/sales_management/nsop_quotation");
const auth = require("../../middlewares/auth");
const uploadImages = require("../../middlewares/sales_management/nsop_quotation/uploadImages");
const editImages = require("../../middlewares/sales_management/nsop_quotation/editImages");
const validation = require("../../middlewares/sales_management/nsop_quotation/validator");
const router = express.Router();

router.get(
  "/nsop_quotation/next_number",
  auth.authCheck,
  quotation.getNextNumber
);

router.get(
  "/pdf_data/nsop_quotation/:id",
  auth.validateAPI,
  quotation.detailQuotation
);

router.post(
  "/delete_nsop_quotation",
  auth.authCheck,
  quotation.deleteQuotations
);

router
  .route("/nsop_quotation")
  .post(
    auth.authCheck,
    uploadImages,
    validation.createQuotation,
    quotation.createQuotation
  )
  .get(auth.authCheck, quotation.listQuotations);

router
  .route("/nsop_quotation/:id")
  .get(auth.authCheck, quotation.detailQuotation)
  .put(auth.authCheck, editImages, quotation.updateQuotation);

router
  .route("/download_nsop_quotation/:id")
  .get(auth.authCheck, quotation.downloadQuotation);

module.exports = router;

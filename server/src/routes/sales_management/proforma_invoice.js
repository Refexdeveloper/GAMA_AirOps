const express = require("express");
const proforma_invoice = require("../../controllers/sales_management/proforma_invoice");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get(
  "/proforma_invoice/next_number",
  auth.authCheck,
  proforma_invoice.getNextNumber
);

router.get(
  "/pdf_data/proforma_invoice/:id",
  auth.validateAPI,
  proforma_invoice.detailPI
);

router.post(
  "/delete_proforma_invoice",
  auth.authCheck,
  proforma_invoice.deletePIs
);

router
  .route("/proforma_invoice")
  .post(auth.authCheck, proforma_invoice.createPI)
  .get(auth.authCheck, proforma_invoice.listPIs);

router
  .route("/proforma_invoice/:id")
  .get(auth.authCheck, proforma_invoice.detailPI)
  .put(auth.authCheck, proforma_invoice.updatePI);

router
  .route("/download_proforma_invoice/:id")
  .get(auth.authCheck, proforma_invoice.downloadPI);

module.exports = router;

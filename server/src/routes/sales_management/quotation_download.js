const express = require("express");
const validation = require("../../middlewares/sales_management/downloadQuotationValidator");
const auth = require("../../middlewares/auth");
const downloadQuotation = require("../../controllers/sales_management/quotation_download");
const router = express.Router();

router.route("/download-quotation").post(auth.validateAPI,validation.downloadPDF,downloadQuotation.downloadPDF);

module.exports = router
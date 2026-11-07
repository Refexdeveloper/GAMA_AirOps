const express = require("express");
const briefSheet = require("../../controllers/sales_management/brief_sheet");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get(
  "/brief_sheet/next_number",
  auth.authCheck,
  briefSheet.getNextNumber
);

// router.get("/generate_pdf", briefSheet.testPDFGeneration);
router.get(
  "/pdf_data/brief_sheet/:id",
  auth.validateAPI,
  briefSheet.detailBriefSheet
);

router.post(
  "/delete_brief_sheet",
  auth.authCheck,
  briefSheet.deleteBriefSheets
);

router
  .route("/brief_sheet")
  .get(auth.authCheck, briefSheet.listBriefSheets)
  .post(auth.authCheck, briefSheet.creatBriefSheet);

router
  .route("/brief_sheet/:id")
  .get(auth.authCheck, briefSheet.detailBriefSheet)
  .put(auth.authCheck, briefSheet.updateBriefSheet);

router
  .route("/download_brief_sheet/:id")
  .get(auth.authCheck, briefSheet.downloadBriefSheet);

module.exports = router;

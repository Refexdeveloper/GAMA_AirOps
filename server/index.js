require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const { sequelize } = require("./src/models/index");
const {
  fixProformaInvoiceAircraftNullable,
} = require("./src/migrations/fixProformaInvoiceAircraftNullable");
const history = require("connect-history-api-fallback");
const status = require("./src/helpers/Response");

const app = express();

// Middleware to parse incoming JSON data ==================================
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/uploads", express.static(__dirname + "/uploads"));

// Configuration for CORS Origin ------------------------------------------------------
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://192.168.14.121:3000"],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );
app.use(cors("*")); // To allow all orgins =============================

app.use("/auth", require("./src/routes/auth"));

app.use(
  "/api",
  require("./src/routes/administration"),
  require("./src/routes/user"),
  require("./src/routes/dashboard"),
  require("./src/routes/sales_management/customer"),
  require("./src/routes/sales_management/lead"),
  require("./src/routes/sales_management/quotation"),
  require("./src/routes/sales_management/nsop_quotation"),
  require("./src/routes/sales_management/proforma_invoice"),
  require("./src/routes/sales_management/brief_sheet"),
  require("./src/routes/trip_management/masters/operator"),
  require("./src/routes/trip_management/masters/airport"),
  require("./src/routes/trip_management/masters/aircraft"),
  require("./src/routes/trip_management/masters/aircraft_model"),
  require("./src/routes/trip_management/masters/country"),
  require("./src/routes/trip_management/masters/city"),
  require("./src/routes/trip_management/masters/zone"),
  require("./src/routes/trip_management/masters/designation"),
  require("./src/routes/trip_management/masters/crew"),
  require("./src/routes/sales_management/quotation_download")
);

app.all("/api/*", (req, res) => {
  return status.ResponseStatus(res, 404, "Endpoint Not Found");
});

// Use client build output only — run `npm run build` in /client (no dist copy into server)
const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));
app.use(history());

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;

fixProformaInvoiceAircraftNullable(sequelize)
  .catch((e) =>
    console.warn("ProformaInvoice aircraft_id migration (non-fatal):", e.message)
  )
  .then(() => sequelize.sync({ alter: true }))
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

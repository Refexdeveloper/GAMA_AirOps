const {
  QuotationDownload,
  MastersAircraftModel,
  MastersAirport,
} = require("../../models");
const status = require("../../helpers/Response");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { validationResult } = require("express-validator");
const { getDistance } = require("geolib");
const { APP_URL } = process.env;

const aircraft_preparing_hours = 3;

async function getCostDetailsForAirports(
  departureLatLong = { latitude: 0, longitude: 0 },
  arrivalLatLong = { latitude: 0, longitude: 0 },
  aircraftSpeed = 0,
  perHourCost = 0
) {
  const distance = getDistance(departureLatLong, arrivalLatLong) / 1000;

  const speed = aircraftSpeed * 1.852;
  const timeInHours = distance / speed;
  const takeoffLandingTime = 0.5; // Takeoff and landing time in hours
  const totalTimeInHours = timeInHours + takeoffLandingTime;

  const hours = Math.floor(totalTimeInHours);
  const minutes = Math.round((totalTimeInHours - hours) * 60);
  const seconds = Math.round(totalTimeInHours - hours - minutes / 60);

  const chargePerQuarter = perHourCost / 4;
  const totalMinutes = hours * 60 + minutes;

  const flightCost = Math.ceil(totalMinutes / 15) * chargePerQuarter; // Total charge in rupees

  // console.log(flightCost);

  return {
    hours,
    minutes,
    seconds,
    totalMinutes,
    flightCost,
  };
}

async function isPreparableTrip(isoDate1 = "", isoDate2 = "", res) {
  // Convert ISO strings to Date objects
  try {
    const date1 = new Date(isoDate1);
    const date2 = new Date(isoDate2);
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(date2 - date1);

    // Calculate the number of milliseconds in 2 hours
    const twoHoursInMilliseconds = aircraft_preparing_hours * 60 * 60 * 1000;

    // Check if the time difference is at least 2 hours
    return timeDifference >= twoHoursInMilliseconds;
  } catch (error) {
    return status.ResponseStatus(
      res,
      400,
      `Invalid date & time formate. Required ISO 8601 format`
    );
  }
}

async function covertToTimeString(totalMinutes) {
  // Separating Total minutes into hours and minutes.
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let timeString = "";
  if (hours > 1) {
    timeString += hours + " hrs ";
  } else if (hours > 0) {
    timeString += hours + " hr ";
  }

  if (minutes > 1) {
    timeString += minutes + " mins";
  } else if (minutes > 0) {
    timeString += minutes + " min";
  }

  return timeString;
}

function generateSerialNumber(prefix, id, length) {
  const paddedId = String(id).padStart(length, "0"); // Add leading zeros to the ID
  return `${prefix}${paddedId}`;
}

module.exports = {
  downloadPDF: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }
      const { aircraft_id, type = "", data = [] } = req.body;

      if (data.length) {
        if (type === "oneway" && data.length > 1)
          return status.ResponseStatus(
            res,
            400,
            `One way journey should have only one transit`
          );
        if (type === "roundtrip" && data.length !== 2)
          return status.ResponseStatus(
            res,
            400,
            `Round trip journey should have only two transit`
          );
        if (type === "multicity" && data.length < 2)
          return status.ResponseStatus(
            res,
            400,
            `Multicity journey should have at least two transit`
          );

        const selected_aircraft = await MastersAircraftModel.findByPk(
          aircraft_id,
          {
            include: [
              { association: "base_airport", include: ["city"] },
              "images",
              "creator",
              "updater",
            ],
          }
        );

        if (selected_aircraft) {
          let flight_plan = [];
          let estimated_price = 0;
          let total_minutes = 0;
          const {
            id,
            aircraft_manufacture,
            aircraft_model,
            aircraft_type,
            wing_type,
            pilots,
            seats,
            baggages_capacity,
            aircraft_attendant_availability,
            wifi_availability,
            satellite_phone,
            lavatory,
            cabin_height,
            cabin_width,
            cabin_length,
            period_of_manufacture,
            length,
            height,
            wingspan,
            empty_weight,
            max_take_of_weight,
            max_payload,
            fuel_capacity,
            engine,
            engine_model,
            max_cruising_speed,
            runway_length,
            max_ceiling,
            range,
            aircraft_per_hour_cost,
            base_airport,
            images,
            created_user,
            updated_user,
          } = selected_aircraft;

          let baseAirportCoordinates = {};

          const firstAirport = await MastersAirport.findByPk(
            data[0].departure_airport_id,
            { include: "city" }
          );
          if (!firstAirport) {
            return status.ResponseStatus(
              res,
              400,
              `Can't find the airport with the id-${data[0].departure_airport_id}`
            );
          }
          const lastAirport = await MastersAirport.findByPk(
            data[data.length - 1].arrival_airport_id,
            { include: "city" }
          );
          if (!lastAirport) {
            return status.ResponseStatus(
              res,
              400,
              `Can't find the airport with the id-${
                data[data.length - 1].arrival_airport_id
              }`
            );
          }

          if (base_airport) {
            baseAirportCoordinates = {
              latitude: base_airport.latitude,
              longitude: base_airport.longitude,
            };
          }
          const firstAirportCoordinates = {
            latitude: firstAirport.latitude,
            longitude: firstAirport.longitude,
          };
          const lastAirportCoordinates = {
            latitude: lastAirport.latitude,
            longitude: lastAirport.longitude,
          };

          if (base_airport && base_airport.id !== firstAirport.id) {
            const flightDetails = await getCostDetailsForAirports(
              baseAirportCoordinates,
              firstAirportCoordinates,
              max_cruising_speed,
              aircraft_per_hour_cost
            );
            estimated_price = estimated_price + flightDetails.flightCost;
            total_minutes = total_minutes + flightDetails.totalMinutes;
            const s_date = new Date(data[0].start_at);
            s_date.setHours(
              s_date.getHours() -
                (flightDetails.hours + aircraft_preparing_hours)
            );
            s_date.setMinutes(s_date.getMinutes() - flightDetails.minutes);
            s_date.setSeconds(s_date.getSeconds() - flightDetails.seconds);
            const start_date = s_date.toISOString();
            s_date.setHours(s_date.getHours() + flightDetails.hours);
            s_date.setMinutes(s_date.getMinutes() + flightDetails.minutes);
            s_date.setSeconds(s_date.getSeconds() + flightDetails.seconds);
            const end_date = s_date.toISOString();

            flight_plan.push({
              pax: 0,
              departure_airport_id: base_airport.id,
              departure_airport: base_airport.airport_name,
              departure_airport_city: base_airport.city.city_name,
              arrival_airport_id: firstAirport.id,
              arrival_airport: firstAirport.airport_name,
              arrival_airport_city: firstAirport.city.city_name,
              flight_type: "Empty Leg",
              start_at: start_date,
              end_at: end_date,
              flight_cost: flightDetails.flightCost.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              }),
              flight_time: await covertToTimeString(flightDetails.totalMinutes),
              // flight_time: `${flightDetails.hours
              //   .toString()
              //   .padStart(2, "0")}:${flightDetails.minutes
              //   .toString()
              //   .padStart(2, "0")}:${flightDetails.seconds
              //   .toString()
              //   .padStart(2, "0")}`,
            });
          }

          let next_departure_id = data[0].departure_airport_id;

          for (let i = 0; i < data.length; i++) {
            const {
              departure_airport_id,
              arrival_airport_id,
              pax = 0,
              start_at,
            } = data[i];

            if (departure_airport_id === arrival_airport_id)
              return status.ResponseStatus(
                res,
                400,
                `Departure airport and arrival airport can't be same airport`
              );

            if (
              next_departure_id != departure_airport_id ||
              (type === "roundtrip" && first_airport_id !== last_airport_id)
            )
              return status.ResponseStatus(res, 400, "Invalid flight route");
            next_departure_id = arrival_airport_id;

            if (
              i != data.length - 1 &&
              !(await isPreparableTrip(start_at, data[i + 1].start_at, res))
            )
              return status.ResponseStatus(
                res,
                400,
                `The departure time of next trip should be minimum three hours from the previous trip`
              );

            const departureAirport = await MastersAirport.findByPk(
              departure_airport_id,
              { include: "city" }
            );
            if (!departureAirport) {
              return status.ResponseStatus(
                res,
                400,
                `Can't find the airport with the id-${departure_airport_id}`
              );
            }
            const departureAirportCoordinates = {
              latitude: departureAirport.latitude,
              longitude: departureAirport.longitude,
            };

            const arrivalAirport = await MastersAirport.findByPk(
              arrival_airport_id,
              { include: "city" }
            );
            if (!arrivalAirport) {
              return status.ResponseStatus(
                res,
                400,
                `Can't find the airport with the id-${arrival_airport_id}`
              );
            }
            const arrivalAirportCoordinates = {
              latitude: arrivalAirport.latitude,
              longitude: arrivalAirport.longitude,
            };

            const flightDetails = await getCostDetailsForAirports(
              departureAirportCoordinates,
              arrivalAirportCoordinates,
              max_cruising_speed,
              aircraft_per_hour_cost
            );
            estimated_price = estimated_price + flightDetails.flightCost;
            total_minutes = total_minutes + flightDetails.totalMinutes;

            const date = new Date(start_at);
            date.setHours(date.getHours() + flightDetails.hours);
            date.setMinutes(date.getMinutes() + flightDetails.minutes);
            date.setSeconds(date.getSeconds() + flightDetails.seconds);
            const end_at = date.toISOString();

            flight_plan.push({
              pax: pax,
              departure_airport_id,
              departure_airport: departureAirport.airport_name,
              departure_airport_city: departureAirport.city.city_name,
              arrival_airport_id,
              arrival_airport: arrivalAirport.airport_name,
              arrival_airport_city: arrivalAirport.city.city_name,
              flight_type: "With Pax",
              start_at,
              end_at,
              flight_cost: flightDetails.flightCost.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              }),
              flight_time: await covertToTimeString(flightDetails.totalMinutes),
              // flight_time: `${flightDetails.hours
              //   .toString()
              //   .padStart(2, "0")}:${flightDetails.minutes
              //   .toString()
              //   .padStart(2, "0")}:${flightDetails.seconds
              //   .toString()
              //   .padStart(2, "0")}`,
            });
          }

          if (base_airport && base_airport.id !== lastAirport.id) {
            const flightDetails = await getCostDetailsForAirports(
              lastAirportCoordinates,
              baseAirportCoordinates,
              max_cruising_speed,
              aircraft_per_hour_cost
            );
            estimated_price = estimated_price + flightDetails.flightCost;
            total_minutes = total_minutes + flightDetails.totalMinutes;

            const date = new Date(flight_plan[flight_plan.length - 1].end_at);
            date.setHours(date.getHours() + aircraft_preparing_hours);
            const start_date = date.toISOString();
            date.setHours(date.getHours() + flightDetails.hours);
            date.setMinutes(date.getSeconds() + flightDetails.minutes);
            date.setSeconds(date.getSeconds() + flightDetails.seconds);
            const end_date = date.toISOString();

            flight_plan.push({
              pax: 0,
              departure_airport_id: lastAirport.id,
              departure_airport: lastAirport.airport_name,
              departure_airport_city: lastAirport.city.city_name,
              arrival_airport_id: base_airport.id,
              arrival_airport: base_airport.airport_name,
              arrival_airport_city: base_airport.city.city_name,
              flight_type: "Empty Leg",
              start_at: start_date,
              end_at: end_date,
              flight_cost: flightDetails.flightCost.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              }),
              flight_time: await covertToTimeString(flightDetails.totalMinutes),
              // flight_time: `${flightDetails.hours
              //   .toString()
              //   .padStart(2, "0")}:${flightDetails.minutes
              //   .toString()
              //   .padStart(2, "0")}:${flightDetails.seconds
              //   .toString()
              //   .padStart(2, "0")}`,
            });
          }

          const flightDetailsHead = [
            "Date",
            "Departure",
            "Arrival",
            "Fly Time",
            "ETD",
          ];
          const flightDetailsBody = [];

          const tripCostHead = [
            "Date",
            "Departure",
            "Arrival",
            "Fly Time",
            "Pax",
            "Cost",
          ];
          const tripCostBody = [];

          for (let i = 0; i < flight_plan.length; i++) {
            const {
              pax,
              departure_airport_id,
              departure_airport,
              departure_airport_city,
              arrival_airport_id,
              arrival_airport,
              arrival_airport_city,
              flight_type,
              start_at,
              end_at,
              flight_cost,
              flight_time,
            } = flight_plan[i];
            // console.log(start_at);
            const startDateTime = new Date(start_at);
            const date = startDateTime.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            });
            const etd = startDateTime.toLocaleTimeString("en-GB", {
              timeZone: "UTC",
            });

            flightDetailsBody.push([
              date,
              departure_airport_city,
              arrival_airport_city,
              flight_time,
              etd,
            ]);

            tripCostBody.push([
              date,
              departure_airport_city,
              arrival_airport_city,
              flight_time,
              pax ? pax : "Empty Leg",
              flight_cost,
            ]);
          }

          if (flight_plan.length) {
            const pdfName = `pdf_${Date.now()}.pdf`;
            // Pipe the PDF to a writable stream and save it to public/upload folder
            const pdfPath = `uploads/quotations/${pdfName}`;
            const pdfResult = await QuotationDownload.create({
              file_name: pdfName,
            });
            if (pdfResult) {
              const doc = new PDFDocument({ margin: 0 });
              doc.registerFont(
                "Roboto-Regular",
                "./fonts/Roboto/Roboto-Regular.ttf"
              );
              doc.registerFont("Roboto-Bold", "./fonts/Roboto/Roboto-Bold.ttf");
              // Generate a unique filename for the PDF

              doc.pipe(fs.createWriteStream(pdfPath));

              // Add the first page with fixed image
              doc.image("./uploads/assests/pdf_template/first_page.jpg", {
                width: 612,
                height: 800,
              }); // Fixed image for the first page

              // Add header with image to subsequent pages
              doc.on("pageAdded", () => {
                doc.image("./uploads/assests/pdf_template/header.png", {
                  width: 613,
                  align: "center",
                });
              });

              let addFooter = false;

              // Add footer with image to each page
              doc.on("pageAdded", () => {
                if (addFooter) {
                  doc.image("./uploads/assests/pdf_template/footer.png", {
                    width: 769,
                    align: "center",
                    y: doc.page.height - 76,
                    x: doc.page.height - 945,
                  });
                }
              });

              for (let i = 0; i < 5; i++) {
                doc.addPage();

                if (i === 0) {
                  addFooter = true;
                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      `   
                                Aircraft : ${aircraft_model}
                                Serial No. : ${generateSerialNumber(
                                  "SAPL/QU/",
                                  pdfResult.id,
                                  5
                                )}
                                Date : ${new Date().toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}`,
                      400,
                      100,
                      { align: "left" }
                    );
                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      ` 
                              Dear Sir/Madam,
                                      
                              We are Pleased to offer to you the ${aircraft_model} Aircraft.
                              The commercials for the same will be as follows`,
                      0,
                      100,
                      { align: "left" }
                    );

                  doc
                    .font("Roboto-Bold")
                    .fontSize(10)
                    .text(`Flight Details:`, 49, 190, {
                      align: "justify",
                      underline: true,
                    });

                  const cellWidth = 100;
                  const cellHeight = 20;
                  const headerHeight = 20;
                  const headerColor = "#000075";
                  const headerTextColor = "white";
                  const bodyTextColor = "black";
                  const bodyRowColors = ["lightblue", "white"];
                  const borderWidth = 0.6;

                  // Function to draw cell with text
                  const drawCell = (
                    text,
                    x,
                    y,
                    width,
                    height,
                    color,
                    textColor
                  ) => {
                    const textHeight = doc.heightOfString(text, {
                      width: width,
                    });
                    const textY =
                      y + (height - textHeight) / 2 + textHeight * 0.25;

                    doc
                      .rect(x, y, width, height)
                      .lineWidth(borderWidth)
                      .fillAndStroke(color, "black");
                    doc
                      .fillColor(textColor)
                      .font("Roboto-Regular")
                      .fontSize(8)
                      .text(text, x, textY, {
                        width: width,
                        height: height,
                        align: "center",
                        valign: "center",
                      });
                  };

                  // Function to draw table
                  const drawTable = (x, y, headerRow, bodyRows) => {
                    // Draw header row
                    let startX = x;
                    doc
                      .fillColor(headerTextColor)
                      .font("Roboto-Bold")
                      .fontSize(9);
                    headerRow.forEach((header, index) => {
                      drawCell(
                        header,
                        startX,
                        y,
                        cellWidth,
                        headerHeight,
                        headerColor,
                        headerTextColor
                      );
                      startX += cellWidth;
                    });

                    // Draw body rows
                    bodyRows.forEach((row, rowIndex) => {
                      startX = x;
                      const fillColor =
                        bodyRowColors[rowIndex % bodyRowColors.length];
                      doc
                        .fillColor(bodyTextColor)
                        .font("Roboto-Regular")
                        .fontSize(8);
                      row.forEach((cell, cellIndex) => {
                        drawCell(
                          cell,
                          startX,
                          y + headerHeight + rowIndex * cellHeight,
                          cellWidth,
                          cellHeight,
                          fillColor,
                          bodyTextColor
                        );
                        startX += cellWidth;
                      });
                    });
                  };

                  // Adjust table position with x and y axes
                  const adjustTablePosition = (x, y, headerRow, bodyRows) => {
                    drawTable(x, y, headerRow, bodyRows);
                  };

                  // Adjust table position by providing x and y coordinates
                  adjustTablePosition(
                    50,
                    210,
                    flightDetailsHead,
                    flightDetailsBody
                  );

                  doc.image(
                    `./uploads/aircrafts/${images.aircraft_image_1}`,
                    0,
                    490,
                    {
                      width: 623,
                      height: 300,
                    }
                  );
                  doc.image("./uploads/assests/pdf_template/footer.png", {
                    width: 769,
                    align: "center",
                    y: doc.page.height - 76,
                    x: doc.page.height - 945,
                  });
                }
                if (i === 1) {
                  addFooter = true;

                  doc
                    .font("Roboto-Bold")
                    .fontSize(10)
                    .text(`Trip Cost Estimation:`, 10, 100, {
                      align: "justify",
                      underline: true,
                    });

                  const cellWidth = 100;
                  const cellHeight = 20;
                  const headerHeight = 20;
                  const headerColor = "#000075";
                  const headerTextColor = "white";
                  const bodyTextColor = "black";
                  const bodyRowColors = ["lightblue", "white"];
                  const borderWidth = 0.6;

                  // Function to draw cell with text
                  const drawCell = (
                    text,
                    x,
                    y,
                    width,
                    height,
                    color,
                    textColor
                  ) => {
                    const textHeight = doc.heightOfString(text, {
                      width: width,
                    });
                    const textY =
                      y + (height - textHeight) / 2 + textHeight * 0.25;

                    doc
                      .rect(x, y, width, height)
                      .lineWidth(borderWidth)
                      .fillAndStroke(color, "black");

                    doc
                      .fillColor(textColor)
                      .font("Roboto-Regular")
                      .fontSize(8)
                      .text(text, x, textY, {
                        width: width,
                        height: height,
                        align: "center",
                        valign: "center",
                      });
                  };

                  // Function to draw table
                  const drawTable = (x, y, headerRow, bodyRows) => {
                    // Draw header row
                    let startX = x;
                    doc
                      .fillColor(headerTextColor)
                      .font("Roboto-Bold")
                      .fontSize(9);
                    headerRow.forEach((header, index) => {
                      drawCell(
                        header,
                        startX,
                        y,
                        cellWidth,
                        headerHeight,
                        headerColor,
                        headerTextColor
                      );
                      startX += cellWidth;
                    });

                    // Draw body rows
                    bodyRows.forEach((row, rowIndex) => {
                      startX = x;
                      const fillColor =
                        bodyRowColors[rowIndex % bodyRowColors.length];
                      doc
                        .fillColor(bodyTextColor)
                        .font("Roboto-Regular")
                        .fontSize(8);
                      row.forEach((cell, cellIndex) => {
                        drawCell(
                          cell,
                          startX,
                          y + headerHeight + rowIndex * cellHeight,
                          cellWidth,
                          cellHeight,
                          fillColor,
                          bodyTextColor
                        );
                        startX += cellWidth;
                      });
                    });
                  };

                  // Adjust table position with x and y axes
                  const adjustTablePosition = (x, y, headerRow, bodyRows) => {
                    drawTable(x, y, headerRow, bodyRows);
                  };

                  // Adjust table position by providing x and y coordinates
                  adjustTablePosition(5, 120, tripCostHead, tripCostBody);

                  doc
                    .font("Roboto-Bold")
                    .fontSize(10)
                    .text("Cost Details:", 30, 380, {
                      lineGap: 1,
                      underline: true,
                    })
                    .text("Amount:", 500, 380, { lineGap: 1, underline: true });

                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text("Total Flight Time:", 30, 400);
                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(await covertToTimeString(total_minutes), 100, 400, {
                      align: "right",
                      width: 445,
                    });

                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text("Flying Cost:", 30, 420);
                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      estimated_price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }),
                      100,
                      420,
                      { align: "right", width: 445 }
                    );

                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text("GST (18%):", 30, 440);
                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      (estimated_price * 0.18).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }),
                      100,
                      440,
                      { align: "right", width: 445 }
                    );

                  doc
                    .font("Roboto-Bold")
                    .fontSize(8)
                    .fillColor("#000075")
                    .text("Grand Total:", 30, 460);
                  doc
                    .font("Roboto-Bold")
                    .fontSize(8)
                    .text(
                      (estimated_price + estimated_price * 0.18).toLocaleString(
                        "en-IN",
                        {
                          style: "currency",
                          currency: "INR",
                        }
                      ),
                      100,
                      460,
                      {
                        align: "right",
                        width: 445,
                        bold: true,
                      }
                    );

                  doc.image(
                    `./uploads/interiors/${images.interior_image_1}`,
                    0,
                    500,
                    {
                      width: 287,
                      height: 300,
                    }
                  );
                  doc.image(
                    `./uploads/interiors/${images.interior_image_1}`,
                    292,
                    500,
                    { width: 320, height: 250 }
                  );
                  doc.image("./uploads/assests/pdf_template/footer.png", {
                    width: 769,
                    align: "center",
                    y: doc.page.height - 76,
                    x: doc.page.height - 945,
                  });
                }
                if (i === 2) {
                  // doc.image(
                  //   "./uploads/aircrafts/cabin_gallery/specification2.jpg",
                  //   50,
                  //   100,
                  //   { width: 280, height: 250 }
                  // );

                  doc
                    .font("Roboto-Bold")
                    .fontSize(12)
                    .text("Aircraft Specification", 130, 100, {
                      align: "left",
                      underline: true,
                    });

                  const headerRow = ["Attribute", "Value"];
                  const tableWidth = 290; // Adjusted width for the entire table

                  const numOfColumns = headerRow.length;
                  const cellWidth = tableWidth / numOfColumns; // Adjusted width for each cell
                  const cellHeight = 20; // Adjusted height for each cell
                  const headerHeight = 20; // Adjusted height for header
                  const headerColor = "#000075";
                  const headerTextColor = "white";
                  const bodyTextColor = "black";
                  const bodyRowColors = ["lightblue", "white"];
                  const borderWidth = 0.6;

                  // Function to draw cell with text
                  const drawCell = (
                    text,
                    x,
                    y,
                    width,
                    height,
                    color,
                    textColor
                  ) => {
                    const textHeight = doc.heightOfString(text, {
                      width: width,
                    });
                    const textY =
                      y + (height - textHeight) / 2 + textHeight * 0.25;

                    doc
                      .rect(x, y, width, height)
                      .lineWidth(borderWidth)
                      .fillAndStroke(color, "black");

                    doc
                      .fillColor(textColor)
                      .font("Roboto-Regular")
                      .fontSize(10)
                      .text(text, x + 10, textY, {
                        width: width,
                        height: height,
                        align: "left",
                        valign: "center",
                      });
                  };

                  // Function to draw table
                  const drawTable = (x, y, headerRow, bodyRows) => {
                    // Draw header row
                    let startX = x;
                    doc
                      .fillColor(headerTextColor)
                      .font("Roboto-Bold")
                      .fontSize(12);
                    headerRow.forEach((header, index) => {
                      drawCell(
                        header,
                        startX,
                        y,
                        cellWidth,
                        headerHeight,
                        headerColor,
                        headerTextColor
                      );
                      startX += cellWidth;
                    });

                    // Draw body rows
                    bodyRows.forEach((row, rowIndex) => {
                      startX = x;
                      const fillColor =
                        bodyRowColors[rowIndex % bodyRowColors.length];
                      doc
                        .fillColor(bodyTextColor)
                        .font("Roboto-Regular")
                        .fontSize(8);
                      row.forEach((cell, cellIndex) => {
                        drawCell(
                          cell,
                          startX,
                          y + headerHeight + rowIndex * cellHeight,
                          cellWidth,
                          cellHeight,
                          fillColor,
                          bodyTextColor
                        );
                        startX += cellWidth;
                      });
                    });
                  };

                  // Example usage
                  const bodyRows = [
                    ["Aircraft Model", `${aircraft_model}`],
                    ["Aircraft Type", `${aircraft_type}`],
                    [
                      "Baggage Capacity",
                      `${baggages_capacity ? baggages_capacity : "-"}`,
                    ],
                    ["Cruise Speed", `${max_cruising_speed} kts`],
                    ["Max Passenger", `${seats ? seats : "-"}`],
                    [
                      "Year of Manufacture",
                      `${period_of_manufacture ? period_of_manufacture : "-"}`,
                    ],
                    [
                      "Home Base",
                      `${base_airport ? base_airport.city.city_name : "-"}`,
                    ],
                    ["Pilots", `${pilots ? pilots : "-"}`],
                    [
                      "Max. Range / Flying Range",
                      `${range ? range + " nm" : "-"}`,
                    ],
                    ["Stand up cabin", "Yes"],
                    ["Cabin height", `${height ? height + " ft." : "-"}`],
                    ["Cabin width", "6 ft."],
                    ["Cabin length", `${length ? length + "ft." : "-"}`],
                    ["Lavatory", `${lavatory ? "Yes" : "No"}`],
                  ];

                  // Adjust table position by providing x and y coordinates
                  drawTable(50, 120, headerRow, bodyRows);

                  doc.image(`./uploads/lopas/${images.lopa_image}`, 420, 100, {
                    width: 70,
                    height: 300,
                  });

                  doc
                    .font("Roboto-Bold")
                    .fontSize(10)
                    .text(`Please Note:`, 0, 580, {
                      align: "center",
                      underline: true,
                    });
                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      `
                                    1. All quotations/options provided above are subject to all necessary permission and aircraft availability at the time of charter confirmation.
                                          
                                    2. Airport Handling Charges are approximation, this will be charged on actuals.
                                          
                                    3. Flying time approximate may change on actuals.
                                          
                                    4. TBL for pilots for any waiting beyond 4 hours or over night journeys will be chargeable extra on Actuals.
                                          
                                    5. This Quotes will valid for 24 Hours, but does not Guarantee a reservation/ Booking. Aircraft booking are always on first come first served basis.`,
                      0,
                      610
                    );
                }
                if (i === 3) {
                  doc
                    .font("Roboto-Bold") // Set font to bold
                    .fontSize(10)
                    .text("Terms & Conditions:", 0, 80, {
                      align: "center",
                      underline: true,
                    });
                  doc
                    .font("Roboto-Regular") // Set font back to normal
                    .fontSize(8)
                    .text(
                      `
                                      
                                    1. We would require the requested information within the stipulated timelines, in order to enable us to seek the necessary permissions for the 
                                    effecting of the flight.
                  
                                    2. Sparzana Aviation Private Limited will not be responsible in any manner whatsoever for passengers traveling without the relevant travel documents 
                                    and/or, carrying any contraband items and/or, involved/indulging in any illegal activities.
                                      
                                    3. Minimum 2 hours ‘per aircraft per day’ or actuals ‘per aircraft per day’, whichever is higher – will charged for a booking.
                                      
                                    4. If there is no flying on a particular day of a Charter, a minimum of 2 (two) hour of flying time will be charged as “Non-Flying Day Charge” 
                                    and in this case, no night halt charge will be levied.
                                      
                                    5. Flying hour charges include the cost of the Aircraft fuel, oil, maintenance, landing and day parking charges, standard in-flight meals,
                                    navigation fees and dispatch cost of the aircraft.
                                      
                                    6. In addition to applicable Taxes, we would be charging for the below mentioned items:
                                    a. Domestic Flights:
                                    (i) Ground Handling service charges
                                    (ii) Extension of watch hours (if applicable)
                                    (iii) Day Detention charges are applicable after 4 hours of waiting at a destination.
                                    (iv) Night Halt charges (if applicable)
                                      
                                    7. Advance Payment:
                                    A minimum booking amount of 10% of quoted value, must be deposited to block the charter. Charters shall be solely made available to the 
                                    parties on First Come,First Served basis.
                  
                                    8. Balance Payment:
                                    The balance payable is payable no later than 72 hours before the operation of your first flight If the booking is made within 72 hours of 
                                    the operation of Charterer’s first flight, the full amount of the Charter Quote is payable to us at that time. Charterer understands and agrees 
                                    that the time of payment is an essential term of this Agreement. Sparzana Aviation reserves its right to withhold services until it receives 
                                    payment of the full amount of the Charter Quote. Should Charterer fail to pay the charter quote in time, then the flight will become subject 
                                    to availability again and may by cancelled by Sparzana Aviation without recourse to Charterer.
                                      
                                    9. Cancellation Terms Should a confirmed flight be cancelled by Charterer; a cancellation fee will be
                                    levied as followed against the full charter price:
                                    (i) 10% with immediate effect
                                    (ii) 25% if cancelled within 14 days of the proposed schedule
                                    (iii) 50% if cancelled within 7 days of the proposed schedule
                                    (iv) 75% if cancelled within 3 days of the proposed schedule
                                    (v) 100% if cancelled on the day of the flight or if the aircraft has positioned.
                                      
                                    10. Any changes/modification of ‘flight program’, requested by the customer after commencement of the ‘flight program’ and if the same
                                    cannot be executed due to operational reasons/lapse of relevant permissions in flight sectors will be termed as ‘a last-minute cancellation’
                                    and the cancellation clause of 100% would apply.
                                    
                                    11. If due to sudden deterioration of weather en-route/destination, the aircraft cannot land at the Destination OR diverted due to 
                                    defense services activity AND has to return to the starting point or divert to some other airport, the actual flying time and any 
                                    other additional charges due to the diversion would be chargeable and balance if any, would be payable / refundable.
                                     
                                    12. The above quote is only indicative and any extra flying on account of diversions due to Air Traffic Control; extra fueling halt
                                    on account of aircraft performance due to weight, altitude, temperature and range limitations will be billed at actuals,
                                    after the flight is conducted in the Final Invoice.
                                  
                                    13. Smoking is not allowed on-board.
                                      
                                    14. Sparzana Aviation Private Limited cannot be held responsible for non-operation of charter for any unforeseen reason/s such as
                                    Bad Weather,Poor Visibility, non – Availability of clearances from ATC / Defense Authorities / Civil Administration. Due to above
                                    reasons, if the flight cannot take off from the Originating station full amount will be refunded (except IFS charges).`,
                      3,
                      100
                    );
                }
                // Check if it's the 5th page and add content accordingly
                if (i === 4) {
                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      `
                                    15. Bank Details:`,
                      3,
                      100
                    );
                  doc.image(
                    "./uploads/assests/pdf_template/bank_details.jpg",
                    67,
                    125,
                    { width: 200, height: 100 }
                  );

                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      `
                                    16. Food Beverages:
                                    We would like to let you know that there are no non-vegetarian food alternatives on our aircraft, and passengers are not permitted
                                    to bring or eat non-vegetarian food on board.
                  
                                    17. MANDATORY INFORMATION:
                                    Passengers must always carry, at the time of entry and/or exit from Airports a valid Photo Identification Proof,
                                    which may be 1. Passport; 2. Aadhaar Card; 3. Voter Id Card; 4. PAN Card; 5. Driving License;6. Nationalized Bank
                                    Passbook with an attested photograph; 7. A Valid Government / State Government/ Armed Services issued Service
                                    Photo ID card; 8. Pension Card / Disability Card with attested Photograph issued by valid Government / State Government.`,
                      3,
                      220
                    );

                  doc
                    .font("Roboto-Bold")
                    .fontSize(9)
                    .text("Dear Guest", 60, 350);

                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      "Greetings from SPARZANA AVIATION PRIVATE LIMITED!!!",
                      60,
                      370
                    );

                  doc
                    .font("Roboto-Regular")
                    .fontSize(8)
                    .text(
                      `
                            You are requested to kindly avoid carrying the following items equipment’s along with you while boarding the aircraft. These items are prohibited to be
                            carried onboard by the Director General of Civil Aviation of India. The client here by agrees to the terms and conditions of the charter as defined above.
                                                  `,
                      6,
                      390
                    );

                  doc
                    .font("Roboto-Bold")
                    .fontSize(8)
                    .text(
                      `
                                    The client hereby agrees to the terms and conditions of the charter as defined above.
                                                  `,
                      6,
                      460
                    );

                  doc.image(
                    "./uploads/assests/pdf_template/discription.png",
                    60,
                    490,
                    { width: 490, height: 100 }
                  );

                  doc
                    .font("Roboto-Bold")
                    .fontSize(8)
                    .text(
                      `
                                        For SPARZANA AVIATION PRIVATE LIMITED                                                                                                                                 For Client
                                                  `,
                      6,
                      630
                    );

                  doc.image(
                    "./uploads/assests/pdf_template/sparzana.png",
                    110,
                    670,
                    { width: 78, height: 60 }
                  );
                }
              }

              doc.end();

              return res.status(200).json({ pdf_url: `${APP_URL}/${pdfPath}` });
              // return res.status(200).json({pdf_url:`${APP_URL}/api/pdf/${pdfName}`});
            }
          }
          return status.ResponseStatus(res, 400, "Failed to create pdf");
        }
        return status.ResponseStatus(res, 400, "Ivalid Aircraft ID");
      }
      return status.ResponseStatus(res, 400, "Trip data should not be empty");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};

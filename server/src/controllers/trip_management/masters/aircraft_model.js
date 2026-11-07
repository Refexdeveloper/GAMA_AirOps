const {
  sequelize,
  MastersAircraftModel,
  MastersAirport,
  MastersAircraftImage,
  Sequelize,
} = require("../../../models");
const status = require("../../../helpers/Response");
const { getDistance } = require("geolib");
const fs = require("fs");
const dayjs = require("dayjs");
const xlsx = require("xlsx");
const { validationResult } = require("express-validator");
const { Op, where } = require("sequelize");
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

async function convertTotalMinutesToTimeFormat(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.round((totalMinutes - hours * 60 - minutes) * 100) / 100;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

function durationToMinutes(durationString) {
  const parts = durationString.split(":").map(Number);
  let totalMinutes = 0;

  if (parts.length === 1) {
    // Format: mm
    totalMinutes = parts[0];
  } else if (parts.length === 2) {
    // Format: hh:mm
    totalMinutes = parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // Format: hh:mm:ss
    totalMinutes = parts[0] * 60 * 60 + parts[1] * 60 + parts[2];
  }

  return totalMinutes;
}

module.exports = {
  searchAircraftModel: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }
      const { type = "", data = [], included_aircraft_types = [] } = req.body;
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

        let aircrafts = [];
        let min_trip_cost = 0;
        let max_trip_cost = 0;
        let min_flight_duration = 0;
        let max_flight_duration = 0;
        const uniqueTypesSet = new Set();
        const models = await MastersAircraftModel.findAll({
          include: [
            { association: "base_airport", include: ["city"] },
            "images",
            "creator",
            "updater",
          ],
        });

        if (models.length) {
          for (let i = 0; i < models.length; i++) {
            let flight_plan = [];
            let estimated_price = 0;
            let total_minutes = 0;
            let largest_pax = 0;
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
              creator,
              updater,
            } = models[i];
            uniqueTypesSet.add(aircraft_type);
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
                departure_airport: `${base_airport.city.city_name}(${base_airport.icao_code}), ${base_airport.airport_name}`,
                departure_airport_city: base_airport.city.city_name,
                arrival_airport_id: firstAirport.id,
                arrival_airport: `${firstAirport.city.city_name}(${firstAirport.icao_code}), ${firstAirport.airport_name}`,
                arrival_airport_city: firstAirport.city.city_name,
                flight_type: "Empty Leg",
                start_at: dayjs(start_date).format("YYYY-MM-DD HH:mm"),
                end_at: dayjs(end_date).format("YYYY-MM-DD HH:mm"),
                flight_cost: flightDetails.flightCost.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                }),
                flight_time: `${flightDetails.hours
                  .toString()
                  .padStart(2, "0")}:${flightDetails.minutes
                  .toString()
                  .padStart(2, "0")}:${flightDetails.seconds
                  .toString()
                  .padStart(2, "0")}`,
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
                (type === "roundtrip" && firstAirport.id !== lastAirport.id)
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

              if (pax > largest_pax) largest_pax = pax;

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
                departure_airport: `${departureAirport.city.city_name}(${departureAirport.icao_code}), ${departureAirport.airport_name}`,
                departure_airport_city: departureAirport.city.city_name,
                arrival_airport_id,
                arrival_airport: `${arrivalAirport.city.city_name}(${arrivalAirport.icao_code}), ${arrivalAirport.airport_name}`,
                arrival_airport_city: arrivalAirport.city.city_name,
                flight_type: "With Pax",
                start_at: dayjs(start_at).format("YYYY-MM-DD HH:mm"),
                end_at: dayjs(end_at).format("YYYY-MM-DD HH:mm"),
                flight_cost: flightDetails.flightCost.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                }),
                flight_time: `${flightDetails.hours
                  .toString()
                  .padStart(2, "0")}:${flightDetails.minutes
                  .toString()
                  .padStart(2, "0")}:${flightDetails.seconds
                  .toString()
                  .padStart(2, "0")}`,
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
              date.setMinutes(date.getMinutes() + flightDetails.minutes);
              date.setSeconds(date.getSeconds() + flightDetails.seconds);
              const end_date = date.toISOString();

              flight_plan.push({
                pax: 0,
                departure_airport_id: lastAirport.id,
                departure_airport: `${lastAirport.city.city_name}(${lastAirport.icao_code}), ${lastAirport.airport_name}`,
                departure_airport_city: lastAirport.city.city_name,
                arrival_airport_id: base_airport.id,
                arrival_airport: `${base_airport.city.city_name}(${base_airport.icao_code}), ${base_airport.airport_name}`,
                arrival_airport_city: base_airport.city.city_name,
                flight_type: "Empty Leg",
                start_at: dayjs(start_date).format("YYYY-MM-DD HH:mm"),
                end_at: dayjs(end_date).format("YYYY-MM-DD HH:mm"),
                flight_cost: flightDetails.flightCost.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                }),
                flight_time: `${flightDetails.hours
                  .toString()
                  .padStart(2, "0")}:${flightDetails.minutes
                  .toString()
                  .padStart(2, "0")}:${flightDetails.seconds
                  .toString()
                  .padStart(2, "0")}`,
              });
            }

            if (seats >= largest_pax) {
              const gst_cost = estimated_price * 0.18;
              const total_cost = estimated_price + gst_cost;
              if (min_trip_cost === 0) min_trip_cost = estimated_price;
              if (min_flight_duration === 0)
                min_flight_duration = total_minutes;

              if (estimated_price > max_trip_cost)
                max_trip_cost = estimated_price;
              if (estimated_price < min_trip_cost)
                min_trip_cost = estimated_price;
              if (total_minutes > max_flight_duration)
                max_flight_duration = total_minutes;
              if (total_minutes < min_flight_duration)
                min_flight_duration = total_minutes;

              aircrafts = [
                ...aircrafts,
                {
                  id,
                  aircraft_manufacture,
                  aircraft_model,
                  aircraft_type,
                  wing_type,
                  aircraft_per_hour_cost: aircraft_per_hour_cost.toLocaleString(
                    "en-IN",
                    { style: "currency", currency: "INR" }
                  ),
                  estimated_price: estimated_price.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }),
                  gst_cost: gst_cost.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }),
                  total_cost: total_cost.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }),
                  total_time: await convertTotalMinutesToTimeFormat(
                    total_minutes
                  ),
                  base_location: base_airport
                    ? `${base_airport.city.city_name}(${base_airport.icao_code}), ${base_airport.airport_name}`
                    : null,
                  specification: {
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
                  },
                  journey_type: type,
                  flight_plan,
                  images: {
                    id: images ? images.id : null,
                    aircraft_image_1: images
                      ? `${APP_URL}/uploads/aircrafts/${images.aircraft_image_1}`
                      : null,
                    aircraft_image_2: images
                      ? `${APP_URL}/uploads/aircrafts/${images.aircraft_image_2}`
                      : null,
                    aircraft_image_3: images
                      ? `${APP_URL}/uploads/aircrafts/${images.aircraft_image_3}`
                      : null,
                    aircraft_lopa: images
                      ? `${APP_URL}/uploads/lopas/${images.lopa_image}`
                      : null,
                    cabin_image: images
                      ? `${APP_URL}/uploads/cabins/${images.cabin_image}`
                      : null,
                    interior_image_1: images
                      ? `${APP_URL}/uploads/interiors/${images.interior_image_1}`
                      : null,
                    interior_image_2: images
                      ? `${APP_URL}/uploads/interiors/${images.interior_image_2}`
                      : null,
                    interior_image_3: images
                      ? `${APP_URL}/uploads/interiors/${images.interior_image_3}`
                      : null,
                  },
                },
              ];
            }
          }

          const info = {
            min_trip_cost,
            max_trip_cost,
            min_flight_duration: await convertTotalMinutesToTimeFormat(
              min_flight_duration
            ),
            max_flight_duration: await convertTotalMinutesToTimeFormat(
              max_flight_duration
            ),
            available_aircraft_types: Array.from(uniqueTypesSet),
          };

          if (
            req.query.min_trip_cost !== undefined &&
            req.query.max_trip_cost !== undefined
          ) {
            // Parse min_trip_cost and max_trip_cost from query parameters
            const min_trip_cost = parseFloat(req.query.min_trip_cost);
            const max_trip_cost = parseFloat(req.query.max_trip_cost);

            // Check if the parameters are valid numbers
            if (isNaN(min_trip_cost))
              return status.ResponseStatus(
                res,
                400,
                `Invalid minimum trip cost (${req.query.min_trip_cost})`
              );
            if (isNaN(max_trip_cost))
              return status.ResponseStatus(
                res,
                400,
                `Invalid maximum trip cost (${req.query.max_trip_cost})`
              );

            aircrafts = aircrafts.filter((aircraft) => {
              const estimated_price = parseInt(
                aircraft.estimated_price.replace(/[^\d.-]/g, ""),
                10
              );
              return (
                estimated_price >= min_trip_cost &&
                estimated_price <= max_trip_cost
              );
            });
          }

          if (
            req.query.min_flight_duration !== undefined &&
            req.query.max_flight_duration !== undefined
          ) {
            const min_flight_duration = durationToMinutes(
              req.query.min_flight_duration
            );
            const max_flight_duration = durationToMinutes(
              req.query.max_flight_duration
            );

            // Check if the parameters are valid numbers
            if (isNaN(min_flight_duration))
              return status.ResponseStatus(
                res,
                400,
                `Invalid minimum flight duration (${req.query.min_flight_duration})`
              );
            if (isNaN(max_flight_duration))
              return status.ResponseStatus(
                res,
                400,
                `Invalid maximum flight duration (${req.query.max_flight_duration})`
              );

            aircrafts = aircrafts.filter((aircraft) => {
              const total_time = durationToMinutes(aircraft.total_time);

              return (
                total_time >= min_flight_duration &&
                total_time <= max_flight_duration
              );
            });
          }

          if (included_aircraft_types.length) {
            aircrafts = aircrafts.filter((aircraft) =>
              included_aircraft_types.includes(aircraft.aircraft_type)
            );
          }

          aircrafts.sort(
            (a, b) =>
              parseInt(a.total_cost.replace(/[^\d.-]/g, ""), 10) -
              parseInt(b.total_cost.replace(/[^\d.-]/g, ""), 10)
          );

          if (aircrafts.length > 0) {
            return status.ResponseStatus(
              res,
              200,
              `${aircrafts.length} result found`,
              aircrafts,
              info
            );
          }
        }
        return status.ResponseStatus(res, 400, "No data found");
      }
      return status.ResponseStatus(res, 400, "Data should not be empty");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  importAircraftModels: async (req, res) => {
    try {
      if (!req.file) {
        return status.ResponseStatus(res, 400, "File is required");
      }
      const { user_id } = req.session_data;
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
      const worksheet = workbook.Sheets[sheetName];

      const modelData = xlsx.utils.sheet_to_json(worksheet);
      // console.log(employeesData);
      const successData = [];
      const failureData = [];

      for (let i = 0; i < modelData.length; i++) {
        try {
          const model = {
            aircraft_model: modelData[i]["Aircraft Model"],
            aircraft_manufacture: modelData[i]["Aircraft Manufacture"],
            aircraft_type: modelData[i]["Aircraft Type"],
            wing_type: modelData[i]["Wing Type"],
            pilots: modelData[i]["Pilots"],
            seats: modelData[i]["Seats"],
            baggages_capacity: modelData[i]["Baggages Capacity"],
            aircraft_attendant_availability:
              modelData[i]["Aircraft Attendant Availability"].toLowerCase() ===
              "yes",
            wifi_availability:
              modelData[i]["Wifi Availability"].toLowerCase() === "yes",
            satellite_phone:
              modelData[i]["Satellite Phone"].toLowerCase() === "yes",
            lavatory: modelData[i]["Lavatory"].toLowerCase() === "yes",
            cabin_height: modelData[i]["Cabin Height"],
            cabin_width: modelData[i]["Cabin Width"],
            cabin_length: modelData[i]["Cabin Length"],
            period_of_manufacture: modelData[i]["Period Of Manufacture"],
            length: modelData[i]["Length"],
            height: modelData[i]["Height"],
            wingspan: modelData[i]["Wingspan"],
            empty_weight: modelData[i]["Empty weight"],
            max_take_off_weight: modelData[i]["Max Take Off Weight"],
            max_payload: modelData[i]["Max Payload"],
            fuel_capacity: modelData[i]["Fuel Capacity"],
            engine: modelData[i]["Engine"],
            engine_model: modelData[i]["Engine Model"],
            max_cruising_speed: modelData[i]["Max Cruising Speed"],
            runway_length: modelData[i]["Runway Length"],
            max_ceiling: modelData[i]["Max Ceiling"],
            range: modelData[i]["Range"],
            aircraft_per_hour_cost: modelData[i]["Aircraft Per Hour Cost"],
            base_location: modelData[i]["Base Location"],
            created_by: user_id,
            updated_by: user_id,
          };

          const isExistsModel = await MastersAircraftModel.findOne({
            where: {
              [Op.and]: [
                { aircraft_model: model.aircraft_model },
                { aircraft_manufacture: model.aircraft_manufacture },
              ],
            },
          });

          if (!isExistsModel) {
            const result = await MastersAircraftModel.create(model);
            if (result) successData.push(modelData[i]);
            else failureData.push(modelData[i]);
          } else {
            failureData.push(modelData[i]);
          }
        } catch (error) {
          console.log(error);
          failureData.push(modelData[i]);
        }
      }
      if (successData.length > 0) {
        return status.ResponseStatus(res, 200, "Data imported successfully", {
          successData,
          failureData,
        });
      } else {
        return status.ResponseStatus(res, 400, "Data import unsuccessful", {
          successData,
          failureData,
        });
      }
    } catch (error) {
      console.error("Error importing data:", error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  exportAircraftModels: async (req, res) => {
    try {
      const modelData = await MastersAircraftModel.findAll();
      let models = [];
      for (let i = 0; i < modelData.length; i++) {
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
          base_location,
          images,
          creator,
          updated,
        } = modelData[i];

        models.push({
          // Id: id,
          "Aircraft Model": aircraft_model,
          "Aircraft Manufacture": aircraft_manufacture,
          "Aircraft Type": aircraft_type,
          "Wing Type": wing_type,
          Pilots: pilots,
          Seats: seats,
          "Baggages Capacity": baggages_capacity,
          "Aircraft Attendant Availability": aircraft_attendant_availability
            ? "Yes"
            : "No",
          "Wifi Availability": wifi_availability ? "Yes" : "No",
          "Satellite Phone": satellite_phone ? "Yes" : "No",
          Lavatory: lavatory ? "Yes" : "No",
          "Cabin Height": cabin_height,
          "Cabin Width": cabin_width,
          "Cabin Length": cabin_length,
          "Period Of Manufacture": period_of_manufacture,
          Length: length,
          Height: height,
          Wingspan: wingspan,
          "Empty Weight": empty_weight,
          "Max Take Of Weight": max_take_of_weight,
          "Max Payload": max_payload,
          "Fuel Capacity": fuel_capacity,
          Engine: engine,
          "Engine Model": engine_model,
          "Max Cruising Speed": max_cruising_speed,
          "Runway Length": runway_length,
          "Max Ceiling": max_ceiling,
          Range: range,
          "Aircraft Per Hour Cost": aircraft_per_hour_cost,
          "Base Location": base_location,
        });
      }

      const filename = "AircraftModels.xlsx";
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(models);
      xlsx.utils.book_append_sheet(wb, ws, "AircraftModels");
      const wbBuffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(wbBuffer);
    } catch (error) {
      console.error("Error exporting data:", error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  createAircraftModel: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      let images = {};
      req.uploads.aircraft.map((a_file, index) => {
        images[`aircraft_image_${index + 1}`] = a_file.filename;
      });
      images["lopa_image"] = req.uploads.lopa[0].filename;
      images["cabin_image"] = req.uploads.cabin[0].filename;
      req.uploads.interior.map((i_file, index) => {
        images[`interior_image_${index + 1}`] = i_file.filename;
      });

      const { user_id } = req.session_data;
      const {
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
        base_location,
      } = req.body;

      const aircraftModel = {
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
        images,
        created_by: user_id,
        updated_by: user_id,
      };
      if (!base_location) {
        aircraftModel.base_location = null;
      }
      const result = await MastersAircraftModel.create(aircraftModel, {
        include: ["images"],
      });

      if (!result)
        return status.ResponseStatus(
          res,
          400,
          "Failed to create Aircraft Model"
        );

      return status.ResponseStatus(
        res,
        201,
        "Aircraft Model created successfully"
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  detailAircratModel: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await MastersAircraftModel.findByPk(id, {
        include: [
          { association: "base_airport", include: ["city"] },
          "images",
          "creator",
          "updater",
        ],
      });
      if (!result)
        return status.ResponseStatus(
          res,
          404,
          `Aircraft model not found with id-${id}`
        );
      const {
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
        base_location,
        base_airport,
        images,
        creator,
        updater,
      } = result;

      let aircraft = [];
      let lopa = [];
      let cabin = [];
      let interior = [];

      if (images) {
        aircraft = [
          images.aircraft_image_1 &&
            `${APP_URL}/uploads/aircrafts/${images.aircraft_image_1}`,
          images.aircraft_image_2 &&
            `${APP_URL}/uploads/aircrafts/${images.aircraft_image_2}`,
          images.aircraft_image_3 &&
            `${APP_URL}/uploads/aircrafts/${images.aircraft_image_3}`,
        ];
        lopa = [
          images.lopa_image && `${APP_URL}/uploads/lopas/${images.lopa_image}`,
        ];
        cabin = [
          images.cabin_image &&
            `${APP_URL}/uploads/cabins/${images.cabin_image}`,
        ];
        interior = [
          images.interior_image_1 &&
            `${APP_URL}/uploads/interiors/${images.interior_image_1}`,
          images.interior_image_2 &&
            `${APP_URL}/uploads/interiors/${images.interior_image_2}`,
          images.interior_image_3 &&
            `${APP_URL}/uploads/interiors/${images.interior_image_3}`,
        ];
      }

      const model = {
        aircraft_manufacture,
        aircraft_model,
        aircraft_type,
        wing_type,
        aircraft_per_hour_cost,
        base_location,
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
        aircraft,
        lopa,
        cabin,
        interior,
        base_airport,
        images: images
          ? {
              id: images.id,
              aircraft_image_1: `${APP_URL}/uploads/aircrafts/${images.aircraft_image_1}`,
              aircraft_image_2: `${APP_URL}/uploads/aircrafts/${images.aircraft_image_2}`,
              aircraft_image_3: `${APP_URL}/uploads/aircrafts/${images.aircraft_image_3}`,
              aircraft_lopa: `${APP_URL}/uploads/lopas/${images.lopa_image}`,
              cabin_image: `${APP_URL}/uploads/cabins/${images.cabin_image}`,
              interior_image_1: `${APP_URL}/uploads/interiors/${images.interior_image_1}`,
              interior_image_2: `${APP_URL}/uploads/interiors/${images.interior_image_2}`,
              interior_image_3: `${APP_URL}/uploads/interiors/${images.interior_image_3}`,
            }
          : null,
        creator: {
          id: creator.id,
          full_name: creator.full_name,
          email: creator.email,
        },
        updater: {
          id: updater.id,
          full_name: updater.full_name,
          email: updater.email,
        },
      };

      return status.ResponseStatus(
        res,
        200,
        `Details of aircraft model with id-${id}`,
        model
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  getAircraftModel: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await MastersAircraftModel.findByPk(id, {
        include: [
          { association: "base_airport", include: ["city"] },
          "images",
          "creator",
          "updater",
        ],
      });
      if (!result)
        return status.ResponseStatus(
          res,
          404,
          `Aircraft model not found with id-${id}`
        );
      const {
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
        creator,
        updater,
      } = result;

      const model = {
        aircraft_manufacture,
        aircraft_model,
        aircraft_type,
        wing_type,
        aircraft_per_hour_cost,
        base_airport,
        specification: {
          pilots,
          seats,
          baggages_capacity,
          aircraft_attendant_availability,
          wifi_availability: wifi_availability ? "Yes" : "No",
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
        },
        images: images
          ? {
              id: images.id,
              aircraft_image_1: `${APP_URL}/uploads/aircrafts/${images.aircraft_image_1}`,
              aircraft_image_2: `${APP_URL}/uploads/aircrafts/${images.aircraft_image_2}`,
              aircraft_image_3: `${APP_URL}/uploads/aircrafts/${images.aircraft_image_3}`,
              aircraft_lopa: `${APP_URL}/uploads/lopas/${images.lopa_image}`,
              cabin_image: `${APP_URL}/uploads/cabins/${images.cabin_image}`,
              interior_image_1: `${APP_URL}/uploads/interiors/${images.interior_image_1}`,
              interior_image_2: `${APP_URL}/uploads/interiors/${images.interior_image_2}`,
              interior_image_3: `${APP_URL}/uploads/interiors/${images.interior_image_3}`,
            }
          : null,
        creator: {
          id: creator.id,
          full_name: creator.full_name,
          email: creator.email,
        },
        updater: {
          id: updater.id,
          full_name: updater.full_name,
          email: updater.email,
        },
      };

      return status.ResponseStatus(
        res,
        200,
        `Details of aircraft model with id-${id}`,
        model
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  listOfAircrafts: async (req, res) => {
    try {
      const distinctManufactures = await MastersAircraftModel.findAll({
        attributes: [
          [
            Sequelize.fn("DISTINCT", Sequelize.col("aircraft_manufacture")),
            "aircraft_manufacture",
          ],
        ],
      });
      if (distinctManufactures) {
        const list = [];
        for (let i = 0; i < distinctManufactures.length; i++) {
          const models = await MastersAircraftModel.findAll({
            where: {
              aircraft_manufacture:
                distinctManufactures[i].aircraft_manufacture,
            },
          });
          const modelsTemp = [];
          for (let j = 0; j < models.length; j++) {
            modelsTemp.push({
              id: models[j].id,
              aircraft_model: models[j].aircraft_model,
              aircraft_type: models[j].aircraft_type,
              range: models[j].range,
            });
          }
          list.push({
            aircraft_manufacture: distinctManufactures[i].aircraft_manufacture,
            aircraft_models: modelsTemp,
          });
        }

        return status.ResponseStatus(
          res,
          200,
          `List of aircraft manufactures and aircraft models`,
          list
        );
      }
      return status.ResponseStatus(res, 400, "No data found");
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  getAllAircraftModels: async (req, res) => {
    try {
      const rows = await MastersAircraftModel.findAll();

      if (!rows) return status.ResponseStatus(res, 404, "No data available");
      return status.ResponseStatus(
        res,
        200,
        "List of all aircraft models",
        rows
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  listAircraftModels: async (req, res) => {
    try {
      const {
        page = 1,
        size = 10,
        sort = "aircraft_manufacture",
        order = "asc",
        search_field = "",
        search_term = "",
      } = req.query;

      const limit = parseInt(size);
      const offset = (page - 1) * limit;

      let whereClause = {};
      let includeClause = [
        { association: "base_airport" },
        { association: "images" },
        { association: "creator" },
        { association: "updater" },
      ];

      if (search_field && search_term) {
        if (search_field.includes(".")) {
          const [association, field] = search_field.split(".");
          includeClause = includeClause.map((include) => {
            if (include.association === association) {
              include.where = {
                [field]: { [Op.like]: `%${search_term}%` },
              };
              include.required = true; // Ensures only results matching the condition are included
            }
            return include;
          });
        } else {
          whereClause[search_field] = { [Op.like]: `%${search_term}%` };
        }
      }

      const { count, rows } = await MastersAircraftModel.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: [[sort, order]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      const info = {
        total_items: count,
        total_pages: totalPages,
        current_page: parseInt(page),
      };
      if (!count) return status.ResponseStatus(res, 404, "No data available");
      return status.ResponseStatus(
        res,
        200,
        "List of all aircraft models",
        rows,
        info
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  updateAircraftModel: async (req, res) => {
    try {
      const errors = validationResult(req);
      const { id } = req.params;
      const { user_id } = req.session_data;

      if (!errors.isEmpty()) {
        return status.ResponseStatus(res, 400, "Validation Failed", errors);
      }

      const model = await MastersAircraftModel.findOne({ where: { id } });

      // Fetch the existing images first
      const existingImages = await MastersAircraftImage.findOne({
        where: { id: model.image_id },
      });

      if (!existingImages) {
        return status.ResponseStatus(res, 404, "Image data not found");
      }

      if (
        req.uploads.aircraft.length ||
        req.uploads.lopa.length ||
        req.uploads.cabin.length ||
        req.uploads.interior.length
      ) {
        let images = {
          aircraft_image_1: existingImages.aircraft_image_1,
          aircraft_image_2: existingImages.aircraft_image_2,
          aircraft_image_3: existingImages.aircraft_image_3,
          lopa_image: existingImages.lopa_image,
          cabin_image: existingImages.cabin_image,
          interior_image_1: existingImages.interior_image_1,
          interior_image_2: existingImages.interior_image_2,
          interior_image_3: existingImages.interior_image_3,
        };

        if (req.uploads.aircraft.length) {
          // req.uploads.aircraft.map((a_file, index) => {
          //   images[`aircraft_image_${index + 1}`] = a_file.filename;
          // });
          for (let i = 0; i < 3; i++) {
            if (req.uploads.aircraft[i]) {
              images[`aircraft_image_${i + 1}`] =
                req.uploads.aircraft[i].filename;
            } else {
              images[`aircraft_image_${i + 1}`] = null;
            }
          }
        }

        if (req.uploads.lopa.length) {
          images["lopa_image"] = req.uploads.lopa[0].filename;
        }

        if (req.uploads.cabin.length) {
          images["cabin_image"] = req.uploads.cabin[0].filename;
        }

        if (req.uploads.interior.length) {
          // req.uploads.interior.map((i_file, index) => {
          //   images[`interior_image_${index + 1}`] = i_file.filename;
          // });
          for (let i = 0; i < 3; i++) {
            if (req.uploads.interior[i]) {
              images[`interior_image_${i + 1}`] =
                req.uploads.interior[i].filename;
            } else {
              images[`interior_image_${i + 1}`] = null;
            }
          }
        }

        const imageUpdateResult = await MastersAircraftImage.update(images, {
          where: { id: model.image_id },
        });
        if (!imageUpdateResult) {
          return status.ResponseStatus(res, 400, "Can't update Image");
        }

        // await MastersAircraftModel.update(
        //   { updated_by: user_id },
        //   { where: { id } }
        // );

        // return status.ResponseStatus(res, 200, "Images have been Updated");
      }

      const {
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
        base_location,
      } = req.body;

      const aircraftModel = {
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
        base_location,
        updated_by: user_id,
      };

      if (base_location === "") {
        aircraftModel.base_location = null;
      }

      const modelUpdateResult = await MastersAircraftModel.update(
        aircraftModel,
        {
          where: { id },
        }
      );

      if (!modelUpdateResult) {
        return status.ResponseStatus(
          res,
          400,
          "Failed to update Aircraft Model"
        );
      }

      return status.ResponseStatus(
        res,
        200,
        "Aircraft Model updated successfully"
      );
    } catch (error) {
      console.log(error);
      return status.ResponseStatus(res, 500, "Internal server error", error);
    }
  },
  // deleteAircraftModels: async (req, res) => {
  //   try {
  //     const { model_ids = [] } = req.body;
  //     const failure_ids = [];
  //     const success_ids = [];
  //     if (!model_ids.length)
  //       return status.ResponseStatus(res, 400, "Select atleast one model");
  //     for (let i = 0; i < model_ids.length; i++) {
  //       try {
  //         const model = await MastersAircraftModel.findByPk(model_ids[i]);
  //         if (model.image_id) {
  //           const result = await MastersAircraftImage.destroy({
  //             where: { id: model.image_id },
  //           });

  //           if (!result) {
  //             failure_ids.push(model_ids[i]);
  //           } else {
  //             success_ids.push(model_ids[i]);
  //           }
  //         } else {
  //           const result = await MastersAircraftModel.destroy({
  //             where: { id: model_ids[i] },
  //           });
  //           if (!result) {
  //             failure_ids.push(model_ids[i]);
  //           } else {
  //             success_ids.push(model_ids[i]);
  //           }
  //         }
  //       } catch (error) {
  //         failure_ids.push(model_ids[i]);
  //       }
  //     }
  //     if (success_ids.length)
  //       return status.ResponseStatus(
  //         res,
  //         200,
  //         "Aircraft models deleted successfully",
  //         { success_ids, failure_ids }
  //       );
  //     else
  //       return status.ResponseStatus(
  //         res,
  //         400,
  //         "Failed to delete aircraft models",
  //         { success_ids, failure_ids }
  //       );
  //   } catch (error) {
  //     console.log(error);
  //     return status.ResponseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  deleteAircraftModels: async (req, res) => {
    try {
      const { model_ids = [] } = req.body;

      if (!model_ids.length) {
        return status.ResponseStatus(res, 400, "Select at least one model");
      }

      const failure_ids = [];
      const success_ids = [];

      for (const model_id of model_ids) {
        try {
          // Fetch the model details
          const model = await MastersAircraftModel.findByPk(model_id);

          if (!model) {
            failure_ids.push(model_id);
            continue;
          }

          // Delete associated image if exists
          if (model.image_id) {
            const imageDeletionResult = await MastersAircraftImage.destroy({
              where: { id: model.image_id },
            });

            if (!imageDeletionResult) {
              failure_ids.push(model_id);
              continue;
            }
          }

          // Delete the model
          const modelDeletionResult = await MastersAircraftModel.destroy({
            where: { id: model_id },
          });

          if (!modelDeletionResult) {
            failure_ids.push(model_id);
          } else {
            success_ids.push(model_id);
          }
        } catch (error) {
          console.error(
            `Error processing model_id ${model_id}:`,
            error.message
          );
          failure_ids.push(model_id);
        }
      }

      if (success_ids.length) {
        return status.ResponseStatus(
          res,
          200,
          "Aircraft models deleted successfully",
          { success_ids, failure_ids }
        );
      } else {
        return status.ResponseStatus(res, 400, "No records deleted", {
          success_ids,
          failure_ids,
        });
      }
    } catch (error) {
      console.error("Unexpected error during deletion:", error.message);
      return status.ResponseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};

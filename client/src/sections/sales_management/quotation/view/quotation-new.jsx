/* eslint-disable import/no-unresolved */
import axios from 'axios';
// import { useRouter } from 'src/routes/hooks';
import dayjs from 'dayjs';
import { getDistance } from 'geolib';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TabList, TabContext, LoadingButton } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Tab,
  Link,
  Card,
  Stack,
  Slide,
  Table,
  Dialog,
  Button,
  Select,
  styled,
  Divider,
  Tooltip,
  MenuItem,
  TableRow,
  useTheme,
  Container,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  InputLabel,
  Breadcrumbs,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogContent,
  DialogActions,
  InputAdornment,
  TableContainer,
  tableCellClasses,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { FIndian, FFIndian } from 'src/utils/format-number';

import { useAuth } from 'src/context/AuthContext';

import Iconify from 'src/components/iconify';

import MapComponent from '../MapComponent';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1F78E9',
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
    backgroundColor: '#00000018',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    fontWeight: 'bold',
    border: 0,
  },
}));

const MAX_HOUR_COST = 700000;
const MIN_HOUR_COST = 100000;
const TAKE_OFF_TIME = 0.5;

const FCurrency = (value = 0) => `₹ ${FIndian(value)}`;
const FFCurrency = (value = 0) => `₹ ${FFIndian(value)}`;

const HOUR_COST_STEP = 10000;
const HOUR_COST_STAGES = 3;

const buildHourCosts = (baseCost = 0) => {
  const base = Number(baseCost) || 0;
  const costs = [];
  for (let stage = -HOUR_COST_STAGES; stage <= HOUR_COST_STAGES; stage += 1) {
    costs.push(Math.max(0, base + stage * HOUR_COST_STEP));
  }
  return costs;
};

const parseCurrencyInputToNumber = (value) => {
  const raw = String(value ?? '').replace(/[^\d]/g, '');
  if (!raw) return 0;
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
};

const covertToTimeString = (totalMinutes) => {
  // Separating Total minutes into hours and minutes.
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let timeString = '';
  if (hours > 1) {
    timeString += `${hours} hrs `;
  } else if (hours > 0) {
    timeString += `${hours} hr `;
  }

  if (minutes > 1) {
    timeString += `${minutes} mins`;
  } else if (minutes > 0) {
    timeString += `${minutes} min`;
  }

  return timeString;
};

export default function NewPage() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user } = useAuth();

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  const [quotesNo, setQuotesNo] = useState('SAPL/QU-0000');
  const [users, setUsers] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  // const [positioning, setPositioning] = useState({ first: false, last: false });
  // const [baseAirportId, setBaseAirportId] = useState(null);
  // const [baseFirstRefresh, setBaseFirstRefresh] = useState(0);
  // const [baseLastRefresh, setBaseLastRefresh] = useState(0);
  const [aircraftPax, setAircraftPax] = useState([{ label: 'Ferry', pax: 0 }]);
  const [hourCosts, setHourCosts] = useState([0]);
  const [addHourCost, setAddHourCost] = useState(0);
  const [perHourCostInput, setPerHourCostInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [pricingRows, setPricingRows] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapLngLat, setMapLngLat] = useState([{}]);
  // const [mapImgData, setMapImgData] = useState('');

  const [quotation, setQuotation] = useState({
    customer_name: '',
    aircraft_id: null,
    type: 'oneway',
    per_hour_cost: '',
    trips: [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
        duration: 0,
        cost: 0,
      },
    ],
    charges: [
      {
        title: 'Airport Handling Charges',
        cost: 0,
      },
      {
        title: 'Crew Accomodation Charges',
        cost: 0,
      },
      {
        title: 'Ground Handling Charges',
        cost: 0,
      },
      {
        title: 'Halt Charges',
        cost: 0,
      },
      {
        title: 'Other Charges',
        cost: 0,
      },
    ],
    duration: 0,
    trip_cost: 0,
    sub_total: 0,
    discount: 0,
    st_after_discount: 0,
    gst: 0.0,
    grand_total: 0,
    is_simple: "",
    assigned_to: user.id,
  });
  // const [firstBase, setFirstBase] = useState({
  //   departure_airport_id: baseAirportId,
  //   arrival_airport_id: null,
  //   pax: 0,
  //   start_at: null,
  //   duration: 0,
  //   cost: 0,
  // });
  // const [secondBase, setSecondBase] = useState({
  //   departure_airport_id: null,
  //   arrival_airport_id: baseAirportId,
  //   pax: 0,
  //   start_at: null,
  //   duration: 0,
  //   cost: 0,
  // });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('/api/quotation/next_number')
        .then((res) => setQuotesNo(res.data))
        .catch((error) => setQuotesNo('SAPL/QU-0000'));

      await axios
        .get('/api/all_users')
        .then((res) => setUsers(res.data.results))
        .catch((error) => {
          setUsers([]);
        });

      await axios
        .get('/api/all_aircrafts')
        .then((res) => setAircrafts(res.data.results))
        .catch((error) => {
          setAircrafts([]);
        });

      await axios
        .get('/api/airports')
        .then((response) => {
          setAirports(response.data);
        })
        .catch((error) => {
          setAirports([]);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updatedTrips = [...quotation.trips];
    const cost = quotation.per_hour_cost ? quotation.per_hour_cost : 0;

    // eslint-disable-next-line array-callback-return
    quotation.trips.map((trip, index) => {
      // updatedTrips[index].cost = Math.ceil(trip.duration / 15) * (cost / 4);
      updatedTrips[index].cost = Math.round(trip.duration * (cost / 60));
    });

    handleInputChange('trips', updatedTrips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotation.per_hour_cost]);

  useEffect(() => {
    if (!quotation.aircraft_id) {
      const updatedTrips = [
        {
          departure_airport_id: null,
          arrival_airport_id: null,
          pax: 0,
          start_at: null,
          duration: 0,
          cost: 0,
        },
      ];
      if (quotation.type === 'roundtrip' || quotation.type === 'multicity')
        updatedTrips.push({
          departure_airport_id: null,
          arrival_airport_id: null,
          pax: 0,
          start_at: null,
          duration: 0,
          cost: 0,
        });
      setQuotation({ ...quotation, trips: updatedTrips });
      // setPositioning({ first: false, last: false });
      // const updatedTrips = [...quotation.trips];
      // quotation.trips.forEach((trip, index) => {
      //   updatedTrips[index] = {
      //     ...trip,
      //     departure_airport_id: null,
      //     arrival_airport_id: null,
      //     pax: 0,
      //     start_at: null,
      //     duration: 0,
      //     cost: 0,
      //   };
      // });
      // setQuotation({ ...quotation, trips: updatedTrips });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotation.aircraft_id]);

  useEffect(() => {
    const alter = async () => {
      setShowMap(false);
      await generateMap();
    };
    alter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotation.trips]);

  useEffect(() => {
    calculateQuotationCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotation.trips, quotation.per_hour_cost, quotation.discount, quotation.charges]);

  // const handleFirstBaseTrip = (baseId) => {
  //   const updatedTrips = [...quotation.trips];
  //   if(!baseTrip.first && baseId){

  //   }
  // }

  // const handleLastBaseTrip = (aircraftId) => {

  // }

  //   useEffect(() => {
  //   const updatedTrips = [...quotation.trips];

  //   if (
  //     !baseTrip.first &&
  //     baseAirportId &&
  //     updatedTrips[0].departure_airport_id &&
  //     updatedTrips[0].departure_airport_id !== baseAirportId
  //   ) {
  //     updatedTrips.unshift({
  //       departure_airport_id: baseAirportId,
  //       arrival_airport_id: updatedTrips[0].departure_airport_id,
  //       pax: 0,
  //       start_at: null,
  //       duration: 0,
  //       cost: 0,
  //     });
  //     setBaseTrip((prev) => ({ ...prev, first: true }));
  //   } else if (baseTrip.first) {
  //     updatedTrips.shift();
  //     setBaseTrip((prev) => ({ ...prev, first: false }));
  //   }

  //   if (
  //     !baseTrip.first &&
  //     baseAirportId &&
  //     updatedTrips[0].departure_airport_id &&
  //     updatedTrips[0].departure_airport_id !== baseAirportId
  //   ) {
  //     updatedTrips.unshift({
  //       departure_airport_id: baseAirportId,
  //       arrival_airport_id: updatedTrips[0].departure_airport_id,
  //       pax: 0,
  //       start_at: null,
  //       duration: 0,
  //       cost: 0,
  //     });
  //     setBaseTrip((prev) => ({ ...prev, first: true }));
  //   } else if (baseTrip.first) {
  //     updatedTrips.shift();
  //     setBaseTrip((prev) => ({ ...prev, first: false }));
  //   }

  //   handleInputChange('trips', updatedTrips);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [baseAirportId]);

  // useEffect(() => {
  //   const updatedTrips = [...quotation.trips];

  //   if (
  //     !baseTrip.first &&
  //     baseAirportId &&
  //     updatedTrips[0].departure_airport_id &&
  //     updatedTrips[0].departure_airport_id !== baseAirportId
  //   ) {
  //     updatedTrips.unshift({
  //       departure_airport_id: baseAirportId,
  //       arrival_airport_id: updatedTrips[0].departure_airport_id,
  //       pax: 0,
  //       start_at: null,
  //       duration: 0,
  //       cost: 0,
  //     });
  //     setBaseTrip((prev) => ({ ...prev, first: true }));
  //   } else if (baseTrip.first) {
  //     updatedTrips.shift();
  //     setBaseTrip((prev) => ({ ...prev, first: false }));
  //   }
  //   handleInputChange('trips', updatedTrips);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [baseFirstRefresh]);

  // useEffect(() => {
  //   const updatedTrips = [...quotation.trips];

  //   if (
  //     !baseTrip.last &&
  //     baseAirportId &&
  //     updatedTrips[updatedTrips.length - 1].arrival_airport_id &&
  //     updatedTrips[updatedTrips.length - 1].arrival_airport_id !== baseAirportId
  //   ) {
  //     updatedTrips.push({
  //       departure_airport_id: updatedTrips[updatedTrips.length - 1].arrival_airport_id,
  //       arrival_airport_id: baseAirportId,
  //       pax: 0,
  //       start_at: null,
  //       duration: 0,
  //       cost: 0,
  //     });
  //     setBaseTrip((prev) => ({ ...prev, last: true }));
  //   } else if (baseTrip.last) {
  //     updatedTrips.pop();
  //     setBaseTrip((prev) => ({ ...prev, last: false }));
  //   }
  //   handleInputChange('trips', updatedTrips);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [baseLastRefresh]);

  const calculateHoursAndCost = (index) => {
    const trip = quotation.trips[index];
    const { departure_airport_id, arrival_airport_id } = trip;
    if (!departure_airport_id || !arrival_airport_id || !quotation.aircraft_id) {
      setQuotation((prev) => {
        const updatedTrips = [...prev.trips];
        updatedTrips[index].duration = 0;
        updatedTrips[index].cost = 0;
        if (quotation.type === 'roundtrip') {
          updatedTrips[0].duration = 0;
          updatedTrips[0].cost = 0;
          updatedTrips[1].duration = 0;
          updatedTrips[1].cost = 0;
        }
        return { ...prev, trips: updatedTrips };
      });
      return;
    }
    if (departure_airport_id === arrival_airport_id) {
      setValidationErrors({
        [`departure_airport_id_${index}`]: "Departure and Arrival can't be same.",
        [`arrival_airport_id_${index}`]: "Departure and Arrival can't be same.",
      });
      setQuotation((prev) => {
        const updatedTrips = [...prev.trips];
        updatedTrips[index].duration = 0;
        updatedTrips[index].cost = 0;
        if (quotation.type === 'roundtrip') {
          updatedTrips[0].duration = 0;
          updatedTrips[0].cost = 0;
          updatedTrips[1].duration = 0;
          updatedTrips[1].cost = 0;
        }
        return { ...prev, trips: updatedTrips };
      });
      return;
    }
    try {
      const { coordinates: DC = [] } = airports.find(
        (_ap) => _ap.airport_id === departure_airport_id
      );
      const { coordinates: AC = [] } = airports.find(
        (_ap) => _ap.airport_id === arrival_airport_id
      );
      const aircraft = aircrafts.find((_af) => _af.id === quotation.aircraft_id);
      const calculatedDistance = getDistance(
        { latitude: DC[0], longitude: DC[1] },
        { latitude: AC[0], longitude: AC[1] }
      );
      const speed = aircraft.cruising_speed * 1.852;
      const distance = calculatedDistance / 1000; // Convert to kilometers

      const durationInHours = distance / speed + TAKE_OFF_TIME;

      const hours = Math.floor(durationInHours);
      const minutes = Math.round((durationInHours - hours) * 60);

      // Round minutes to the nearest multiple of 5
      const roundedMinutes = Math.round(minutes / 5) * 5;

      // Adjust hours if rounding up goes to the next hour
      const adjustedHours = roundedMinutes === 60 ? hours + 1 : hours;
      const adjustedMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;

      const duration = adjustedHours * 60 + adjustedMinutes;
      console.log(duration);

      // const cost = Math.ceil(duration / 15) * (quotation.per_hour_cost / 4);
      const cost = Math.round(duration * (quotation.per_hour_cost / 60));

      setQuotation((prev) => {
        const updatedTrips = [...prev.trips];
        updatedTrips[index].duration = duration;
        updatedTrips[index].cost = cost;
        if (quotation.type === 'roundtrip') {
          updatedTrips[1].duration = duration;
          updatedTrips[1].cost = cost;
        }
        // console.log(updatedTrips);
        return { ...prev, trips: updatedTrips };
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        action,
      });
    }
  };

  const calculateTotalAGCost = () => {
    setQuotation((prevState) => {
      // Calculate total charges across all trips
      let totalAirportHandling = 0;
      let totalGroundHandling = 0;

      prevState.trips.forEach((trip) => {
        const airport = airports.find((_a) => _a.airport_id === trip.arrival_airport_id);
        if (airport) {
          // Convert to numbers using parseFloat
          totalAirportHandling += parseFloat(airport.airport_handling_charge || 0);
          totalGroundHandling += parseFloat(airport.ground_handling_charge || 0);
        }
      });

      // Update charges array
      const updatedCharges = prevState.charges.map((charge) => {
        if (charge.title === 'Airport Handling Charges') {
          return { ...charge, cost: totalAirportHandling };
        }
        if (charge.title === 'Ground Handling Charges') {
          return { ...charge, cost: totalGroundHandling };
        }
        return charge;
      });

      return {
        ...prevState,
        charges: updatedCharges,
      };
    });
  };

  const createPricingRow = (pricing, cost_1, cost_2, cost_3, selected) => ({
    pricing,
    cost_1,
    cost_2,
    cost_3,
    selected,
  });

  const calculateTripCost = (perHourCost) => {
    let total = 0;
    quotation.trips.forEach((trip) => {
      total += Math.ceil(trip.duration / 15) * (perHourCost / 4);
    });
    return total;
  };

  const calculateQuotationCost = () => {
    let duration = 0;
    let charges_cost = 0;

    let trip_cost = 0;
    const trip_cost_1 = calculateTripCost(hourCosts[0]);
    const trip_cost_2 = calculateTripCost(hourCosts[1]);
    const trip_cost_3 = calculateTripCost(hourCosts[2]);

    quotation.trips.forEach((trip, index) => {
      duration += trip.duration;
      trip_cost += trip.cost;
    });
    quotation.charges.forEach((charge, index) => {
      charges_cost += charge.cost;
    });

    const sub_total = trip_cost + charges_cost;
    const sub_total_1 = trip_cost_1 + charges_cost;
    const sub_total_2 = trip_cost_2 + charges_cost;
    const sub_total_3 = trip_cost_3 + charges_cost;

    const st_after_discount = sub_total - quotation.discount;
    const st_after_discount_1 = sub_total_1 - quotation.discount;
    const st_after_discount_2 = sub_total_2 - quotation.discount;
    const st_after_discount_3 = sub_total_3 - quotation.discount;

    const gst = st_after_discount * 0.18;
    const gst_1 = st_after_discount_1 * 0.18;
    const gst_2 = st_after_discount_2 * 0.18;
    const gst_3 = st_after_discount_3 * 0.18;

    const grand_total = st_after_discount + gst;
    const grand_total_1 = st_after_discount_1 + gst_1;
    const grand_total_2 = st_after_discount_2 + gst_2;
    const grand_total_3 = st_after_discount_3 + gst_3;

    const rows = [
      createPricingRow(
        `Flight Cost for (${covertToTimeString(duration)})`,
        trip_cost_1,
        trip_cost_2,
        trip_cost_3,
        trip_cost
      ),
    ];

    quotation.charges.forEach((charge) => {
      rows.push(createPricingRow(charge.title, charge.cost, charge.cost, charge.cost, charge.cost));
    });

    rows.push(createPricingRow('Sub Total', sub_total_1, sub_total_2, sub_total_3, sub_total));
    rows.push(
      createPricingRow(
        'Discount',
        quotation.discount,
        quotation.discount,
        quotation.discount,
        quotation.discount
      )
    );
    rows.push(
      createPricingRow(
        'Sub Total (After Discount)',
        st_after_discount_1,
        st_after_discount_2,
        st_after_discount_3,
        st_after_discount
      )
    );
    rows.push(createPricingRow('GST (18%)', gst_1, gst_2, gst_3, gst));
    rows.push(
      createPricingRow('Grand Total', grand_total_1, grand_total_2, grand_total_3, grand_total)
    );

    setPricingRows(rows);

    setQuotation({
      ...quotation,
      duration,
      trip_cost,
      sub_total,
      st_after_discount,
      gst,
      grand_total,
    });
  };

  const handleInputChange = (field, value) => {
    setQuotation((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
    // setShowPreview(false);
  };

  const handleTabChange = (value) => {
    setShowPreview(false);
    // eslint-disable-next-line default-case
    switch (value) {
      case 'oneway':
        handleInputChange('trips', [quotation.trips[0]]);
        break;
      case 'roundtrip':
        handleInputChange('trips', [
          quotation.trips[0],
          {
            departure_airport_id: quotation.trips[0].arrival_airport_id,
            arrival_airport_id: quotation.trips[0].departure_airport_id,
            pax: quotation.trips[0].pax,
            start_at: null,
            duration: quotation.trips[0].duration,
            cost: quotation.trips[0].cost,
          },
        ]);
        break;
      case 'multicity': {
        if (quotation.trips.length < 2) {
          const updatedTrips = [...quotation.trips];
          updatedTrips.push({
            departure_airport_id: quotation.trips[0].arrival_airport_id,
            arrival_airport_id: null,
            pax: 0,
            start_at: null,
            duration: 0,
            cost: 0,
          });
          handleInputChange('trips', updatedTrips);
        } else if (quotation.trips.length >= 2) {
          handleInputChange('trips', [
            quotation.trips[0],
            {
              ...quotation.trips[1],
              arrival_airport_id: null,
              pax: 0,
              start_at: null,
              duration: 0,
              cost: 0,
            },
          ]);
        }
      }
    }
    handleInputChange('type', value);
    calculateTotalAGCost();
  };

  const handleChangeAircraft = (event, value) => {
    if (value) {
      const aircraftPerHourCost = Number(value.model.aircraft_per_hour_cost) || 0;
      setHourCosts(buildHourCosts(aircraftPerHourCost));
      handleInputChange('per_hour_cost', aircraftPerHourCost);
      setPerHourCostInput(FIndian(aircraftPerHourCost));
      handleInputChange('aircraft_id', value.id);
      // setBaseAirportId(value.model.base_location);
      // addBaseTrips(value.model.base_location);
      const pax = [];
      for (let i = 0; i <= value.model.seats; i += 1) {
        if (i === 0) pax.push({ label: 'Ferry', pax: i });
        else pax.push({ label: String(i), pax: i });
      }
      setAircraftPax(pax);
      // handleBaseAirportTrip(value.model.base_location, 'departure_airport_id');
      // handleBaseAirportTrip(value.model.base_location, 'arrival_airport_id');
    } else {
      setAddHourCost(0);
      setHourCosts([0]);
      handleInputChange('per_hour_cost', '');
      setPerHourCostInput('');
      handleInputChange('aircraft_id', null);
      // setBaseAirportId(null);
      // addBaseTrips(null);
      setAircraftPax([{ label: 'Ferry', pax: 0 }]);
      // handleBaseAirportTrip(null, 'departure_airport_id');
      // handleBaseAirportTrip(null, 'arrival_airport_id');
    }
  };

  const addTrip = () => {
    const newTrips = [
      ...quotation.trips,
      ...[
        {
          departure_airport_id: quotation.trips[quotation.trips.length - 1].arrival_airport_id,
          arrival_airport_id: null,
          pax: 0,
          start_at: null,
          duration: 0,
          cost: 0,
        },
      ],
    ];
    handleInputChange('trips', newTrips);
  };

  const removeTrip = (index) => {
    const newTrips = quotation.trips.filter((_t, i) => i !== index);
    handleInputChange('trips', newTrips);
    calculateTotalAGCost();
  };

  const removeAllTrip = () => {
    const updatedTrips = [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
        duration: 0,
        cost: 0,
      },
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
        duration: 0,
        cost: 0,
      },
    ];
    handleInputChange('trips', updatedTrips);
    calculateTotalAGCost();
  };

  const handleInputChangeTrips = (index, field, value) => {
    if (!quotation.aircraft_id) {
      enqueueSnackbar('Please select aircraft to calculate flying hours & trip cost..!', {
        variant: 'warning',
        action,
      });
      return;
    }
    const newTrips = [...quotation.trips];
    if (index !== quotation.trips.length - 1 && field === 'arrival_airport_id')
      newTrips[index + 1].departure_airport_id = value;

    if (
      index !== quotation.trips.length - 1 &&
      field === 'departure_airport_id' &&
      quotation.type === 'roundtrip'
    )
      newTrips[index + 1].arrival_airport_id = value;

    if (field === 'duration') {
      // const cost = Math.ceil(value / 15) * (quotation.per_hour_cost / 4);
      const cost = Math.round(value * (quotation.per_hour_cost / 60));
      if (quotation.type === 'roundtrip') {
        newTrips[0].cost = cost;
        newTrips[1].cost = cost;
        newTrips[0].duration = value;
        newTrips[1].duration = value;
      } else {
        newTrips[index].cost = cost;
      }
    }

    newTrips[index][field] = value;
    // setQuotation((prev) => ({ ...prev, trips: newTrips }));

    // if (field === 'departure_airport_id') {
    //   if (
    //     !positioning.first &&
    //     index === 0 &&
    //     baseAirportId &&
    //     newTrips[index].departure_airport_id &&
    //     newTrips[index].departure_airport_id !== baseAirportId
    //   ) {
    //     newTrips.unshift({
    //       departure_airport_id: baseAirportId,
    //       arrival_airport_id: newTrips[index].departure_airport_id,
    //       pax: 0,
    //       start_at: null,
    //       duration: 0,
    //       cost: 0,
    //     });
    //     setPositioning((prev) => ({ ...prev, first: true }));
    //   }
    //   if (
    //     positioning.first &&
    //     index === 1 &&
    //     (!newTrips[index].departure_airport_id ||
    //       newTrips[index].departure_airport_id === baseAirportId)
    //   ) {
    //     newTrips.shift();
    //     setPositioning((prev) => ({ ...prev, first: false }));
    //   }
    // }
    // if (field === 'arrival_airport_id') {
    //   if (
    //     !positioning.last &&
    //     index === newTrips.length - 1 &&
    //     baseAirportId &&
    //     newTrips[index].arrival_airport_id &&
    //     newTrips[index].arrival_airport_id !== baseAirportId
    //   ) {
    //     newTrips.push({
    //       departure_airport_id: newTrips[newTrips.length - 1].arrival_airport_id,
    //       arrival_airport_id: baseAirportId,
    //       pax: 0,
    //       start_at: null,
    //       duration: 0,
    //       cost: 0,
    //     });
    //     setPositioning((prev) => ({ ...prev, last: true }));
    //   }
    //   if (
    //     positioning.last &&
    //     index === newTrips.length - 2 &&
    //     (!newTrips[index].arrival_airport_id ||
    //       newTrips[index].arrival_airport_id === baseAirportId)
    //   ) {
    //     newTrips.pop();
    //     setPositioning((prev) => ({ ...prev, last: false }));
    //   }
    // }

    handleInputChange('trips', newTrips);

    if (field === 'departure_airport_id' || field === 'arrival_airport_id') {
      calculateHoursAndCost(index);
      setShowPreview(false);
    }
    if (field === 'arrival_airport_id') {
      calculateTotalAGCost();
    }
    // if (field === 'departure_airport_id') setBaseFirstRefresh((prev) => prev + 1);
    // if (field === 'arrival_airport_id') setBaseLastRefresh((prev) => prev + 1);
    // handleBaseAirportTrip(baseAirportId, field);
  };

  // const handleBaseAirportTrip = (baseId, field) => {
  //   const newTrips = [...quotation.trips];
  //   console.log(newTrips);
  //   if (field === 'departure_airport_id') {
  //     if (
  //       baseId &&
  //       quotation.trips[0].departure_airport_id &&
  //       quotation.trips[0].departure_airport_id !== baseId &&
  //       !baseTrip.first
  //     ) {
  //       newTrips.unshift({
  //         departure_airport_id: baseId,
  //         arrival_airport_id: quotation.trips[0].departure_airport_id,
  //         pax: 0,
  //         start_at: null,
  //         duration: 0,
  //         cost: 0,
  //       });
  //       setBaseTrip((prev) => ({ ...prev, first: true }));
  //     } else if (baseTrip.first) {
  //       newTrips.shift();
  //       setBaseTrip((prev) => ({ ...prev, first: false }));
  //     }
  //   }
  //   if (field === 'arrival_airport_id') {
  //     if (
  //       baseId &&
  //       quotation.trips[quotation.trips.length - 1].arrival_airport_id &&
  //       quotation.trips[quotation.trips.length - 1].arrival_airport_id !== baseId &&
  //       !baseTrip.last
  //     ) {
  //       newTrips.push({
  //         departure_airport_id: quotation.trips[quotation.trips.length - 1].arrival_airport_id,
  //         arrival_airport_id: baseId,
  //         pax: 0,
  //         start_at: null,
  //         duration: 0,
  //         cost: 0,
  //       });
  //       setBaseTrip((prev) => ({ ...prev, last: true }));
  //     } else if (baseTrip.last) {
  //       newTrips.pop();
  //       setBaseTrip((prev) => ({ ...prev, last: false }));
  //     }
  //   }
  //   handleInputChange('trips', newTrips);
  // };

  const handleInputChangeCharges = (index, field, value) => {
    const newCharges = [...quotation.charges];
    newCharges[index][field] = value;
    handleInputChange('charges', newCharges);
  };

  const validateAddHourCost = (cost) => {
    if (cost >= MIN_HOUR_COST && cost <= MAX_HOUR_COST) {
      setHourCosts((prev) => {
        if (prev.length === 1) return [cost];
        return [...prev, cost];
      });
    } else {
      setHourCosts((prev) => {
        if (prev.length === 1) return [0];
        return [...prev];
      });
      setValidationErrors((prev) => ({
        ...prev,
        ...{
          add_hour_cost: `Amount should be ₹ ${FIndian(MAX_HOUR_COST)} to ₹ ${FIndian(
            MIN_HOUR_COST
          )}`,
        },
      }));
    }
  };

  const covertToTimeDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes}`;
  };

  const generateMap = async () => {
    const LngLat = [];
    // eslint-disable-next-line array-callback-return
    quotation.trips.map(async (trip, index) => {
      if (trip.departure_airport_id && trip.arrival_airport_id) {
        const departure =
          airports.find((_ap) => _ap.airport_id === trip.departure_airport_id) || null;
        const arrival = airports.find((_ap) => _ap.airport_id === trip.arrival_airport_id) || null;

        if (departure)
          LngLat.push({
            name: departure.airport_city,
            coordinates: [departure.coordinates[1], departure.coordinates[0]],
          });
        if (index === quotation.trips.length - 1 && arrival)
          LngLat.push({
            name: arrival.airport_city,
            coordinates: [arrival.coordinates[1], arrival.coordinates[0]],
          });
      }
    });
    setMapLngLat(LngLat);
    setShowMap(true);
  };

  // const handleCaptureMap = (imageBase64) => {
  //   setMapImgData(imageBase64);
  // };

  const validateData = () => {
    const errors = {};
    if (!quotation.customer_name) errors.customer_name = 'Customer Name is required';
    if (!quotation.aircraft_id) errors.aircraft_id = 'Aircraft is required';
    if (!quotation.per_hour_cost) errors.per_hour_cost = 'Per Hour Cost is required';
    else if (quotation.per_hour_cost < MIN_HOUR_COST || quotation.per_hour_cost > MAX_HOUR_COST)
      errors.per_hour_cost = `Amount should be ₹ ${FIndian(MIN_HOUR_COST)} to ₹ ${FIndian(
        MAX_HOUR_COST
      )}`;
    if (!quotation.assigned_to) errors.assigned_to = 'Assigned To is required';
    // eslint-disable-next-line array-callback-return
    quotation.trips.map((trip, index) => {
      if (trip.departure_airport_id === trip.arrival_airport_id) {
        errors[`departure_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
        errors[`arrival_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
      }
      if (!trip.departure_airport_id)
        errors[`departure_airport_id_${index}`] = 'Departure Airport is required';
      if (!trip.arrival_airport_id)
        errors[`arrival_airport_id_${index}`] = 'Arrival Airport is required';
      if (!trip.start_at) errors[`start_at_${index}`] = 'Date & Time is required';
    });
    return errors;
  };

  const handleShowPreview = async () => {
    const errors = validateData();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    await generateMap();
    setShowPreview(true);
    setTimeout(() => {
      const element = document.getElementById('end-of-first-card');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    const errors = validateData();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }
    try {
      await axios
        .post('/api/quotation', quotation)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/sales_management/quotation/list');
            enqueueSnackbar(response.data.message, {
              variant: response.data.status ? 'success' : 'error',
              action,
            });
          }
        })
        .catch((error) => {
          setTimeout(() => {
            setLoading(false);
            enqueueSnackbar(error.response.data.message, { variant: 'error', action });
          }, 3000);
        });
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        enqueueSnackbar(error.message, { variant: 'error', action });
      }, 3000);
    }
  };

  const handleClickAlert = () => {
    setOpenAlert(!openAlert);
  };

  const breadcrumbs = [
    <Link key="1" underline="hover" color="inherit" href="/sales_management">
      Sales&nbsp;Management
    </Link>,
    // <Link underline="hover" key="2" color="inherit" href="/app/masters">
    //   Masters
    // </Link>,
    <Link key="2" underline="hover" color="inherit" href="/sales_management/quotation">
      Quotation
    </Link>,
    <Typography key="3" color="text.disabled">
      New&nbsp;Quotation
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" gutterBottom>
              Create&nbsp;a&nbsp;new&nbsp;quotation
            </Typography>
            <Breadcrumbs
              separator={<Iconify icon="eva:chevron-right-fill" />}
              aria-label="breadcrumb"
              sx={{ color: 'text.primary', display: { xs: 'none', sm: 'block' } }}
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
          {/* <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push('/admin/user/new')}
        >
          New&nbsp;User
        </Button> */}
        </Stack>

        <Card sx={{ overflow: 'visible', py: 1 }}>
          <TabContext value={quotation.type}>
            <Box mt={2} mx={{ xs: 1, md: 2 }} sx={{ flexGrow: 1 }}>
              <Grid
                container
                direction={{ xs: 'column-reverse', md: 'row' }}
                spacing={2}
                columns={{ xs: 4, sm: 12, md: 12 }}
              >
                <Grid xs={4} sm={6} md={6}>
                  <TabList onChange={(e, newValue) => handleTabChange(newValue)}>
                    <Tab label="One Way" value="oneway" />
                    <Tab label="Round Trip" value="roundtrip" />
                    <Tab label="Multi City" value="multicity" />
                  </TabList>
                </Grid>
                <Grid xs={4} sm={6} md={6}>
                  <Grid container spacing={2} columns={{ xs: 4, sm: 6, md: 6 }}>
                    <Grid xs={2.5} sm={3} md={3}>
                      <TextField
                        disabled
                        fullWidth
                        size="small"
                        label="Quotation No"
                        value={quotesNo}
                      />
                    </Grid>
                    <Grid xs={1.5} sm={3} md={3}>
                      <Box display={{ xs: 'none', md: 'block' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer sx={{ mt: -1 }} components={['DateField']}>
                            <DateField
                              disabled
                              fullWidth
                              size="small"
                              id="quote-date-created"
                              label="Date Created"
                              defaultValue={dayjs(new Date())}
                              format="DD / MM / YYYY"
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Box>
                      <Box display={{ xs: 'block', md: 'none' }}>
                        <TextField
                          disabled
                          fullWidth
                          size="small"
                          id="quote-date-created"
                          label="Date Create"
                          defaultValue={new Date().toLocaleDateString('en-IN')}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box mx={{ xs: 1, md: 2 }} mt={2}>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={2.4}>
                  <TextField
                    required
                    fullWidth
                    id="customer_name"
                    label="Customer Name"
                    size="small"
                    value={quotation.customer_name}
                    error={Boolean(validationErrors.customer_name)}
                    helperText={validationErrors.customer_name}
                    onChange={(event, value) =>
                      handleInputChange('customer_name', event.target.value)
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2.4}>
                  <Autocomplete
                    id="aircraft_id"
                    size="small"
                    getOptionLabel={(option) => `${option.model.aircraft_model} (${option.reg_no})`}
                    value={aircrafts.find((_air) => _air.id === quotation.aircraft_id) || null}
                    onChange={handleChangeAircraft}
                    options={aircrafts}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Aircraft"
                        error={Boolean(validationErrors.aircraft_id)}
                        helperText={validationErrors.aircraft_id}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2.4}>
                  <Autocomplete
                    freeSolo
                    disableClearable
                    disabled={!quotation.aircraft_id}
                    id="per_hour_cost"
                    size="small"
                    options={quotation.aircraft_id ? hourCosts : []}
                    getOptionLabel={(option) =>
                      typeof option === 'number' ? `₹ ${FIndian(option)}` : String(option)
                    }
                    value={quotation.per_hour_cost || null}
                    inputValue={perHourCostInput}
                    onChange={(event, value) => {
                      if (typeof value === 'number') {
                        handleInputChange('per_hour_cost', value);
                        setPerHourCostInput(FIndian(value));
                        setValidationErrors((prev) => ({ ...prev, per_hour_cost: undefined }));
                      }
                    }}
                    onInputChange={(event, newInputValue) => {
                      if (!quotation.aircraft_id) return;
                      const next = parseCurrencyInputToNumber(newInputValue);
                      setAddHourCost(next);
                      setPerHourCostInput(FIndian(next));
                      handleInputChange('per_hour_cost', next);
                      if (next >= MIN_HOUR_COST && next <= MAX_HOUR_COST) {
                        setValidationErrors((prev) => ({ ...prev, per_hour_cost: undefined }));
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Per Hour Cost"
                        error={Boolean(validationErrors.per_hour_cost)}
                        helperText={
                          validationErrors.per_hour_cost ||
                          (!quotation.aircraft_id ? 'Please select the aircraft first..!' : '')
                        }
                        InputProps={{
                          ...params.InputProps,
                          inputMode: 'numeric',
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2.4}>
                  <Autocomplete
                    id="aircraft_id"
                    size="small"
                    disableClearable
                    getOptionLabel={(option) => option.name}
                    value={
                      [
                        { name: 'Simplified', value: "Simplified" },
                        { name: 'Detailed', value: "Detailed" },
                          { name: 'One Page', value: "OnePage" },
                      ].find((_air) => _air.value === quotation.is_simple) || null
                    }
                    onChange={(event, value) => {
                      handleInputChange('is_simple', value ? value.value : "Detailed");
                    }}
                    options={[
                      { name: 'Simplified', value: "Simplified" },
                      { name: 'Detailed', value: "Detailed" },
                        { name: 'One Page', value: "OnePage" },
                    ]}
                    renderInput={(params) => (
                      <TextField
                        // required
                        {...params}
                        label="PDF Type"
                        // error={Boolean(validationErrors.aircraft_id)}
                        // helperText={validationErrors.aircraft_id}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2.4}>
                  <Autocomplete
                    id="assigned_to"
                    size="small"
                    value={users.find((_u) => _u.id === quotation.assigned_to) || null}
                    onChange={(event, value) => {
                      handleInputChange('assigned_to', value ? value.id : null);
                    }}
                    options={users}
                    getOptionLabel={(option) => option.email}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Assigned To"
                        error={Boolean(validationErrors.assigned_to)}
                        helperText={validationErrors.assigned_to}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            {/* <TabPanel value="oneway" sx={{ py: 3, px: 2 }}>
            One way
          </TabPanel>
          <TabPanel value="roundtrip">Round trip</TabPanel>
          <TabPanel value="multicity">Multi city</TabPanel> */}
          </TabContext>
          <Box px={1} py={5}>
            {quotation.trips.map((trip, index) => (
              <Grid key={index} p={1} container spacing={2}>
                <Grid xs={12} sm={6} md={2.5}>
                  <Autocomplete
                    id="departure_airport"
                    fullWidth
                    disabled={quotation.type === 'roundtrip' && index === 1}
                    size="small"
                    value={
                      airports.find((_a) => _a.airport_id === trip.departure_airport_id) || null
                    }
                    onChange={(event, value) => {
                      if (value)
                        handleInputChangeTrips(index, 'departure_airport_id', value.airport_id);
                      else handleInputChangeTrips(index, 'departure_airport_id', null);
                    }}
                    options={airports}
                    getOptionLabel={(option) => option.airport_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Departure Airport"
                        error={Boolean(validationErrors[`departure_airport_id_${index}`])}
                        helperText={validationErrors[`departure_airport_id_${index}`]}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2.5}>
                  <Autocomplete
                    id="arrival_airport"
                    fullWidth
                    disabled={quotation.type === 'roundtrip' && index === 1}
                    size="small"
                    value={airports.find((_a) => _a.airport_id === trip.arrival_airport_id) || null}
                    onChange={(event, value) => {
                      if (value)
                        handleInputChangeTrips(index, 'arrival_airport_id', value.airport_id);
                      else handleInputChangeTrips(index, 'arrival_airport_id', null);
                    }}
                    options={airports}
                    getOptionLabel={(option) => option.airport_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Arrival Airport"
                        error={Boolean(validationErrors[`arrival_airport_id_${index}`])}
                        helperText={validationErrors[`arrival_airport_id_${index}`]}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={6} sm={3} md={1}>
                  <Autocomplete
                    id="pax"
                    fullWidth
                    size="small"
                    value={aircraftPax.find((_ap) => _ap.pax === trip.pax) || null}
                    onChange={(event, value) => {
                      if (value) handleInputChangeTrips(index, 'pax', value.pax);
                      else handleInputChangeTrips(index, 'pax', 0);
                    }}
                    options={aircraftPax}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Pax"
                        error={Boolean(validationErrors[`pax_${index}`])}
                        helperText={validationErrors[`pax_${index}`]}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={6} sm={9} md={2.2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Departure Date & Time"
                      format="DD/MM/YYYY HH:mm"
                      ampm={false}
                      minDateTime={
                        index === 0
                          ? dayjs()
                          : quotation.trips[index - 1] && quotation.trips[index - 1].start_at
                      }
                      value={trip.start_at}
                      onChange={(newValue) => handleInputChangeTrips(index, 'start_at', newValue)}
                      slotProps={{
                        textField: {
                          required: true,
                          size: 'small',
                          error: Boolean(validationErrors[`start_at_${index}`]),
                          helperText: validationErrors[`start_at_${index}`],
                        },
                      }}
                      // viewRenderers={{
                      //   hours: renderTimeViewClock,
                      //   minutes: renderTimeViewClock,
                      //   seconds: renderTimeViewClock,
                      // }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={6} sm={6} md={quotation.type === 'multicity' ? 1.65 : 1.9}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Flying Hours (hh:mm)"
                      ampm={false}
                      format="HH    :    mm"
                      value={dayjs(`2000-01-01T${covertToTimeDuration(trip.duration)}`)}
                      onChange={(event) => {
                        handleInputChangeTrips(index, 'duration', event.$H * 60 + event.$m);
                      }}
                      views={['hours', 'minutes']}
                      slotProps={{
                        textField: { size: 'small' },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={4.5} sm={6} md={quotation.type === 'multicity' ? 1.65 : 1.9}>
                  <TextField
                    id="trip_cost"
                    value={FIndian(trip.cost)}
                    size="small"
                    label="Trip Cost"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      readOnly: true,
                    }}
                  />
                </Grid>
                {quotation.type === 'multicity' && (
                  <>
                    {index === 0 ? (
                      <Grid
                        xs={1.5}
                        md={0.5}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Tooltip title="Remove All" placement="right">
                          <IconButton color="error" onClick={removeAllTrip}>
                            <Iconify icon="eva:close-fill" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    ) : (
                      <>
                        {index !== 1 && (
                          <Grid
                            xs={1.5}
                            md={0.5}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Tooltip title="Remove" placement="right">
                              <IconButton color="error" onClick={() => removeTrip(index)}>
                                <Iconify icon="eva:minus-fill" />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        )}
                      </>
                    )}
                  </>
                )}
              </Grid>
            ))}
          </Box>
          <Grid container spacing={2} px={2} pb={1}>
            {quotation.charges.map((charge, index) => (
              <Grid key={index} xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  label={charge.title}
                  value={FIndian(charge.cost)}
                  onChange={(event) => {
                    const { value } = event.target;
                    let numericValue = value.replace(/[^\d.]/g, '');
                    if (numericValue === '') {
                      handleInputChangeCharges(index, 'cost', 0);
                    } else if (/^\d*\.?\d*$/.test(numericValue)) {
                      numericValue = numericValue.replace(/^0+(?=\d)/, '');
                      handleInputChangeCharges(index, 'cost', Number(numericValue));
                    }
                  }}
                  variant="filled"
                  size="small"
                  InputProps={{
                    inputMode: 'numeric',
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
            ))}

            {/* <Grid xs={12} sm={1} md={0.5} /> */}

            <Grid xs={12} sm={6} md={2.4}>
              <TextField
                id="discount"
                variant="filled"
                size="small"
                fullWidth
                label="Discount"
                focused
                color="error"
                value={FIndian(quotation.discount)}
                onChange={(event) => {
                  const { value } = event.target;
                  let numericValue = value.replace(/[^\d.]/g, '');
                  if (numericValue === '') {
                    handleInputChange('discount', 0);
                  } else if (/^\d*\.?\d*$/.test(numericValue)) {
                    numericValue = numericValue.replace(/^0+(?=\d)/, '');
                    handleInputChange('discount', Number(numericValue));
                  }
                }}
                InputProps={{
                  inputMode: 'numeric',
                  startAdornment: <InputAdornment position="start">-₹</InputAdornment>,
                }}
              />
            </Grid>

            <Grid xs={12} md={4.8} />

            {quotation.type !== 'multicity' && <Grid xs={12} sm={6} md={2.4} />}
            <Box id="end-of-first-card" />
            <Grid
              xs={12}
              sm={6}
              md={2.4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                fullWidth
                variant="contained"
                style={{ textTransform: 'none' }}
                startIcon={<Iconify icon="solar:eye-bold" />}
                onClick={handleShowPreview}
              >
                Preview
              </Button>
            </Grid>
            {quotation.type === 'multicity' && (
              <Grid
                xs={12}
                sm={6}
                md={2.4}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  fullWidth
                  variant="contained"
                  style={{ textTransform: 'none' }}
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={addTrip}
                >
                  Add Trip
                </Button>
              </Grid>
            )}
          </Grid>
        </Card>

        {showPreview && (
          <Card>
            <TableContainer sx={{ maxWidth: 'auto' }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Pricing Breakup</StyledTableCell>
                    <StyledTableCell align="right">
                      Cost 1 ({FCurrency(hourCosts[0])}/hr)
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Cost 2 ({FCurrency(hourCosts[1])}/hr)
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Cost 3 ({FCurrency(hourCosts[2])}/hr)
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Selected Cost ({FCurrency(quotation.per_hour_cost)}/hr)
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pricingRows.map((row) => (
                    <StyledTableRow key={row.pricing}>
                      <StyledTableCell component="th" scope="row">
                        {row.pricing}
                      </StyledTableCell>
                      <StyledTableCell align="right">{FFCurrency(row.cost_1)}</StyledTableCell>
                      <StyledTableCell align="right">{FFCurrency(row.cost_2)}</StyledTableCell>
                      <StyledTableCell align="right">{FFCurrency(row.cost_3)}</StyledTableCell>
                      <StyledTableCell
                        align="right"
                        sx={{ backgroundColor: theme.palette.action.selected }}
                      >
                        {FFCurrency(row.selected)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {showMap ? (
              <Box px={2} pt={5} pb={2} sx={{ borderRadius: '20px' }}>
                <MapComponent mapLngLat={mapLngLat} />
              </Box>
            ) : null}
          </Card>
        )}
      </Stack>
      <Grid container justifyContent="flex-end" spacing={3} pt={3}>
        <Grid xs={12} sm={6} md={1.5}>
          <LoadingButton
            loading={loading}
            onClick={handleSubmit}
            variant="outlined"
            color="success"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Create
          </LoadingButton>
        </Grid>
        <Grid xs={12} sm={6} md={1.5}>
          <Button
            onClick={() => {
              if (changeMade) {
                handleClickAlert();
              } else {
                router.push('/sales_management/quotation/list');
              }
            }}
            variant="contained"
            color="error"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Close
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClickAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Created data or changes you where made can&apos;t be save..!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              router.push('/sales_management/quotation/list');
              handleClickAlert();
            }}
          >
            Yes, Close!
          </Button>
          <Button variant="outlined" onClick={handleClickAlert}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

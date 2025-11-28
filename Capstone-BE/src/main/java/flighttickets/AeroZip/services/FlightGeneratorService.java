package flighttickets.AeroZip.services;

import flighttickets.AeroZip.entities.Airport;
import flighttickets.AeroZip.entities.Flight;
import flighttickets.AeroZip.enums.LayoverType;
import flighttickets.AeroZip.utility.DistanceCalculator;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class FlightGeneratorService {

    private static final String[] COMPANIES = {
            "Ryanair", "EasyJet", "Lufthansa", "British Airways",
            "Air France"
    };

    private static final Map<String, String> COMPANY_AVATARS = Map.of(
            "Ryanair", "https://logo.clearbit.com/ryanair.com",
            "EasyJet", "https://logo.clearbit.com/easyjet.com",
            "Lufthansa", "https://logo.clearbit.com/lufthansa.com",
            "British Airways", "https://logo.clearbit.com/britishairways.com",
            "Air France", "https://logo.clearbit.com/airfrance.com"
    );

    public List<Flight> generateFlights(Airport departure, Airport arrival,
                                        LocalDate departDate, int numberOfFlights) {
        List<Flight> flights = new ArrayList<>();
        Random random = new Random();

        // CALCOLA DISTANZA UNA VOLTA SOLA
        double distanceKm = DistanceCalculator.calculateDistance(
                departure.getLatitude(), departure.getLongitude(),
                arrival.getLatitude(), arrival.getLongitude()
        );

        System.out.println("Distanza tra " + departure.getIataCode() + " e " +
                arrival.getIataCode() + ": " + Math.round(distanceKm) + " km");

        // STIMA DURATA BASE DEL VOLO
        int baseDurationMinutes = DistanceCalculator.estimateFlightDuration(distanceKm);

        for (int i = 0; i < numberOfFlights; i++) {
            Flight flight = new Flight();
            flight.setDepartureAirport(departure);
            flight.setArrivalAirport(arrival);
            flight.setDepartDate(departDate);

            // ORARIO PARTENZA CASUALE (5:00 - 23:00)
            int departHour = 5 + random.nextInt(18);
            int departMinute = random.nextInt(12) * 5;
            LocalTime departTime = LocalTime.of(departHour, departMinute);
            flight.setDepartureTime(departTime);

            // DURATA CON VARIAZIONE ±30 minuti
            int durationMinutes = baseDurationMinutes + (random.nextInt(61) - 30);
            if (durationMinutes < 30) durationMinutes = 30;

            // LAYOVER (aggiunge tempo extra)
            LayoverType layover;
            double layoverChance = random.nextDouble();
            if (layoverChance < 0.7) {
                layover = LayoverType.DIRECT;
            } else if (layoverChance < 0.85) {
                layover = LayoverType.ONE_STOP;
                durationMinutes += 60 + random.nextInt(60); // 1-2h di scalo
            } else {
                layover = LayoverType.TWO_STOPS;
                durationMinutes += 120 + random.nextInt(120); // 2-4h di scali
            }
            flight.setLayover(layover);

            // CALCOLA ORARIO ARRIVO
            LocalTime arrivalTime = departTime.plusMinutes(durationMinutes);
            int durationHours = durationMinutes / 60;
            int durationMins = durationMinutes % 60;
            flight.setArrivalTime(arrivalTime);

            String flightTime = String.format("%dh %dm",
//                    departTime.getHour(), departTime.getMinute(),
//                    arrivalTime.getHour(), arrivalTime.getMinute(),
                    durationHours, durationMins);

            flight.setFlightTime(flightTime);

            // COMPAGNIA CASUALE
            String company = COMPANIES[random.nextInt(COMPANIES.length)];
            flight.setCompany(company);
            flight.setCompanyAvatar(COMPANY_AVATARS.getOrDefault(company, ""));
            flight.setFlightCode(FakeFlightCodeService.generateFlightCode(company));


            // CALCOLA COSTO BASATO SU DISTANZA
            // Formula: 50€ base + 0.10€/km + premio volo diretto
            long baseCost = 50 + (long) (distanceKm * 0.10);

            if (layover == LayoverType.DIRECT) {
                baseCost += 50; // I voli diretti costano di più
            } else if (layover == LayoverType.ONE_STOP) {
                baseCost -= 20; // Sconto per 1 scalo
            } else {
                baseCost -= 40; // Sconto maggiore per 2 scali
            }

            // Variazione casuale ±50€
            long variation = random.nextInt(101) - 50;
            flight.setCost(Math.max(30, baseCost + variation)); // minimo 30€

            flights.add(flight);

        }


        return flights;
    }


}
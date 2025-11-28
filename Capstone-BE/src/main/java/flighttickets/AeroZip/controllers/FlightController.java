package flighttickets.AeroZip.controllers;

import flighttickets.AeroZip.entities.Airport;
import flighttickets.AeroZip.payloads.response.FlightDTO;
import flighttickets.AeroZip.repositories.AirportRepository;
import flighttickets.AeroZip.services.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    @Autowired
    AirportRepository airportRepository;
    @Autowired
    FlightService flightService;

    @GetMapping
    public List<FlightDTO> getFlights(@RequestParam String departureIata, @RequestParam String arrivalIata, @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, @RequestParam("passengers") int passengers) {
        Airport departure = findAirport(departureIata, "partenza");
        Airport arrival = findAirport(arrivalIata, "arrivo");
        return flightService.getFlights(departure, arrival, date).stream().map(flight -> new FlightDTO(flight.getId(), flight.getCompany(), flight.getCompanyAvatar(), flight.getFlightCode(), flight.getFlightTime(), flight.getLayover().name(), flight.getDepartDate().atTime(flight.getDepartureTime()).toString(), flight.getDepartDate().atTime(flight.getArrivalTime()).toString(), flight.getCost() * 100, 20000L, flight.getDepartureAirport().getId(), flight.getArrivalAirport().getId(), flight.getDepartDate().toString())).toList();
    }

    private Airport findAirport(String iata, String tipo) {
        if (iata != null) {
            return airportRepository.findByIataCodeIgnoreCase(iata).orElseThrow(() -> new IllegalArgumentException("Aeroporto di " + tipo + " non trovato con IATA " + iata));
        } else {
            throw new IllegalArgumentException("Specificare IATA per l’aeroporto di " + tipo);
        }
    }


}

package flighttickets.AeroZip.services;


import flighttickets.AeroZip.entities.Airport;
import flighttickets.AeroZip.entities.Flight;
import flighttickets.AeroZip.repositories.FlightRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightGeneratorService flightGeneratorService;

    public List<Flight> getFlights(Airport departure, Airport arrival, LocalDate departDate) {
        List<Flight> findedFlights = flightRepository.findByDepartureAirportIdAndArrivalAirportIdAndDepartDate(departure.getId(), arrival.getId(), departDate);

        if (!findedFlights.isEmpty()) return findedFlights;

        List<Flight> generatedFlights = flightGeneratorService.generateFlights(departure, arrival, departDate, 5);
        flightRepository.saveAll(generatedFlights);
        log.info("Salvati {} voli a DB", generatedFlights.size());
        return generatedFlights;
    }
}
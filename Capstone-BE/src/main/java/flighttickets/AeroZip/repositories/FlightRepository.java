package flighttickets.AeroZip.repositories;

import flighttickets.AeroZip.entities.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByDepartureAirportIdAndArrivalAirportIdAndDepartDate(
            Long departureAirportId,
            Long arrivalAirportId,
            LocalDate departDate
    );


}

package flighttickets.AeroZip.repositories;

import flighttickets.AeroZip.entities.Airport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AirportRepository extends JpaRepository<Airport, Long> {

    // Cerca per codice IATA esatto
    Optional<Airport> findByIataCode(String iataCode);

    // Cerca per città esatta
    List<Airport> findByCity(String city);

    // Cerca per nome o codice IATA parziale (case-insensitive)
    List<Airport> findByNameContainingIgnoreCaseOrIataCodeContainingIgnoreCase(String name, String iata);

    List<Airport> findByIataCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrCityContainingIgnoreCase(String iata, String name, String city);

    Optional<Airport> findByIataCodeIgnoreCase(String iataCode);
}

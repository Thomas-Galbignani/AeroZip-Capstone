package flighttickets.AeroZip.repositories;

import flighttickets.AeroZip.entities.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PassengerRepository extends JpaRepository<Passenger, UUID> {
    Optional<Passenger> findByNameAndSurnameAndBirthdate(
            String name,
            String surname,
            String birthdate
    );

    Optional<Passenger> findByEmail(String email);


}
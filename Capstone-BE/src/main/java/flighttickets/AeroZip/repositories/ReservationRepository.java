package flighttickets.AeroZip.repositories;

import flighttickets.AeroZip.entities.Reservation;
import flighttickets.AeroZip.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    List<Reservation> findByUserId(UUID userId);

    List<Reservation> findByStatus(ReservationStatus status);

    void deleteByUserId(UUID userId);
}
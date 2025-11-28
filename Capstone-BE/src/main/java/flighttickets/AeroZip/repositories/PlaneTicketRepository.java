package flighttickets.AeroZip.repositories;

import flighttickets.AeroZip.entities.PlaneTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlaneTicketRepository extends JpaRepository<PlaneTicket, Long> {

    List<PlaneTicket> findByReservationId(UUID reservationId);

    List<PlaneTicket> findByPassengerId(UUID passengerId);

    List<PlaneTicket> findByPassengerIdAndReservationId(UUID passengerId, UUID reservationId);

    Optional<PlaneTicket> findByPassengerIdAndFlightId(UUID passengerId, Long flightId);

    @Modifying
    @Query("DELETE FROM PlaneTicket pt WHERE pt.reservation.user.id = :userId")
    void deleteByUserIdThroughReservation(@Param("userId") UUID userId);
}
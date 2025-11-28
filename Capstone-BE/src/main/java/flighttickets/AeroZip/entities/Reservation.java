package flighttickets.AeroZip.entities;

import flighttickets.AeroZip.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "reservation")
@Data
@ToString(exclude = "tickets")

public class Reservation {
    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    // FK verso User
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // Relazione (una prenotazione può avere molti biglietti)
    @OneToMany(mappedBy = "reservation")
    private Set<PlaneTicket> tickets = new HashSet<>();


    // voli (andata e ritorno)
    @ManyToOne
    @JoinColumn(name = "departing_flight_id")
    private Flight departingFlight;

    @ManyToOne
    @JoinColumn(name = "returning_flight_id", nullable = true)
    private Flight returningFlight;
}
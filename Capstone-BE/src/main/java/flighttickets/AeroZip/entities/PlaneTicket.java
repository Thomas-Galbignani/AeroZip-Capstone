package flighttickets.AeroZip.entities;

import flighttickets.AeroZip.enums.SeatClass;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(
        name = "plane_ticket",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"passenger_id", "flight_id"})
        }
)// questo va così sennò i posti per esempio non potrebbero essere uguali per due voli diversi
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "reservation")
public class PlaneTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String seat;

    @Enumerated(EnumType.STRING)
    private SeatClass seatClass;

    // FK Flight
    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    // FK Passenger
    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    // FK Reservation
    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;


}
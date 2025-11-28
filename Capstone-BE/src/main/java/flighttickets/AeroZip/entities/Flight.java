package flighttickets.AeroZip.entities;

import flighttickets.AeroZip.enums.LayoverType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "flight")
@Data
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    // FK verso Airports
    @ManyToOne
    @JoinColumn(name = "departure_airport", referencedColumnName = "id")
    private Airport departureAirport;

    @ManyToOne
    @JoinColumn(name = "arrival_airport", referencedColumnName = "id")
    private Airport arrivalAirport;

    private LocalDate departDate;
    private LocalDate returnDate;
    private String flightTime;
    private String company;
    private String companyAvatar;
    private String flightCode;
    private Long cost;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    @Enumerated(EnumType.STRING)
    private LayoverType layover;


}
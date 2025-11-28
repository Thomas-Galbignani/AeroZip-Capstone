package flighttickets.AeroZip.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Entity
@Table(name = "passenger")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Passenger {
    @GeneratedValue
    @Id
    @EqualsAndHashCode.Include
    private UUID id;

    private String name;
    private String surname;
    private String birthdate;
    private String email;
    private String phone;
    private int bag;


    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

}
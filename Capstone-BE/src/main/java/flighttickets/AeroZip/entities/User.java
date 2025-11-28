package flighttickets.AeroZip.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "utente")
@Data
public class User {
    @Id
    private UUID id;

    private String name;
    private String surname;
    private String phone;
    private String email;
    private String password;


}
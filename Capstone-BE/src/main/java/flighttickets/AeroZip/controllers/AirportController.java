package flighttickets.AeroZip.controllers;

import flighttickets.AeroZip.payloads.response.AirportDTO;
import flighttickets.AeroZip.repositories.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@RequiredArgsConstructor
public class AirportController {

    private final AirportRepository airportRepository;

    @GetMapping
    public List<AirportDTO> searchAirports(@RequestParam("search") String query) {
        return airportRepository.findByIataCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrCityContainingIgnoreCase(query, query, query)
                .stream()
                .map(a -> new AirportDTO(
                        a.getId(),
                        a.getName(),
                        a.getIataCode()
                ))
                .toList();
    }
}

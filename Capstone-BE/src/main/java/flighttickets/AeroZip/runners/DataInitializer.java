package flighttickets.AeroZip.runners;


import flighttickets.AeroZip.importers.CsvImportService;
import flighttickets.AeroZip.repositories.AirportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CsvImportService csvImportService;
    private final AirportRepository airportRepository;

    @Override
    public void run(String... args) throws Exception {
        // Controlla se ci sono già dati
        if (airportRepository.count() > 0) {
            log.info("Aeroporti già presenti, skip import");
            return;
        }

        log.info("Inizio import aeroporti...");
        Path csvPath = Paths.get("src/main/resources/airports.csv");
        csvImportService.salvaAirports(csvPath);
        log.info("Import completato!");
    }


}


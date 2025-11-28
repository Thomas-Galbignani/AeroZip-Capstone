package flighttickets.AeroZip.importers;

import com.opencsv.CSVReader;
import flighttickets.AeroZip.entities.Airport;
import flighttickets.AeroZip.repositories.AirportRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvImportService {

    @Autowired
    private AirportRepository airportRepository;

    @Transactional
    public void salvaAirports(Path pathFile) throws Exception {
        try (CSVReader reader = new CSVReader(new FileReader(pathFile.toFile()))) {
            reader.readNext(); // skip header

            List<Airport> airports = new ArrayList<>();
            String[] line;

            while ((line = reader.readNext()) != null) {
                if (line.length < 11 || line[0].isEmpty()) continue;

                Airport airport = new Airport();
                airport.setIataCode(line[0].trim());
                airport.setName(line[2].trim());

                // AGGIUNGI LATITUDINE E LONGITUDINE
                try {
                    airport.setLatitude(Double.parseDouble(line[3].trim()));
                    airport.setLongitude(Double.parseDouble(line[4].trim()));
                } catch (NumberFormatException e) {
                    // Salta aeroporti senza coordinate valide
                    continue;
                }

                airport.setCountryCode(line[9].trim().isEmpty() ? null : line[9].trim());
                airport.setCity(line[10].trim().isEmpty() ? null : line[10].trim());

                airports.add(airport);
            }

            airportRepository.saveAll(airports);
            System.out.println("Importati " + airports.size() + " aeroporti con coordinate");
        }
    }
}
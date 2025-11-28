package flighttickets.AeroZip.services;

import flighttickets.AeroZip.exceptions.NotFoundException;

import java.util.Map;
import java.util.Random;

public class FakeFlightCodeService {

    private static final Map<String, String> COMPANY_CODES = Map.of(
            "Ryanair", "FR",
            "EasyJet", "U2",
            "Lufthansa", "LH",
            "British Airways", "BA",
            "Air France", "AF"
    );

    private static final Random random = new Random();

    public static String generateFlightCode(String company) {
        String code = COMPANY_CODES.get(company);
        if (code == null) {
            throw new NotFoundException("Compagnia non trovafa: " + company);
        }
        int flightNumber = 100 + random.nextInt(9900); // numero fittizio
        return code + flightNumber;
    }

    public static void main(String[] args) {
        System.out.println("Codice Ryanair: " + generateFlightCode("Ryanair"));
        System.out.println("Codice EasyJet: " + generateFlightCode("EasyJet"));
        System.out.println("Codice Lufthansa: " + generateFlightCode("Lufthansa"));
        System.out.println("Codice British Airways: " + generateFlightCode("British Airways"));
        System.out.println("Codice Air France: " + generateFlightCode("Air France"));
    }
}
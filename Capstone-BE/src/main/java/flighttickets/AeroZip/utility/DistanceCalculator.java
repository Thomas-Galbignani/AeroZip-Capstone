package flighttickets.AeroZip.utility;

public class DistanceCalculator {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calcola la distanza tra due coordinate geografiche usando la formula di Haversine
     * lat1 Latitudine del primo punto
     * lon1 Longitudine del primo punto
     * lat2 Latitudine del secondo punto
     * lon2 Longitudine del secondo punto
     * Ritorna la distanza in chilometri
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Converti le coordinate da gradi a radianti
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        // Applica la formula di Haversine
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Ritorna la distanza in km
        return EARTH_RADIUS_KM * c;
    }

    public static int estimateFlightDuration(double distanceKm) {
        // Tempo fisso per decollo/atterraggio e procedure (in minuti)
        int fixedTime = 30;

        // Velocità media effettiva considerando salita/discesa
        double effectiveSpeed;

        if (distanceKm < 500) {
            // Voli brevi: più tempo in salita/discesa
            effectiveSpeed = 400.0;
        } else if (distanceKm < 1500) {
            // Voli medi
            effectiveSpeed = 500.0;
        } else {
            // Voli lunghi: più tempo in crociera
            effectiveSpeed = 600.0;
        }

        // Calcola tempo di volo in crociera
        int cruiseTime = (int) (distanceKm / effectiveSpeed * 60);

        return fixedTime + cruiseTime;
    }
}
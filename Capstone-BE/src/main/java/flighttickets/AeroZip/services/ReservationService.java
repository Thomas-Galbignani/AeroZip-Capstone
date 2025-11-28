package flighttickets.AeroZip.services;

import flighttickets.AeroZip.entities.*;
import flighttickets.AeroZip.enums.ReservationStatus;
import flighttickets.AeroZip.enums.SeatClass;
import flighttickets.AeroZip.payloads.request.FlightAssignmentDTO;
import flighttickets.AeroZip.payloads.request.PassengerDTO;
import flighttickets.AeroZip.payloads.request.ReservationRequestDTO;
import flighttickets.AeroZip.payloads.request.SeatDTO;
import flighttickets.AeroZip.payloads.response.*;
import flighttickets.AeroZip.repositories.FlightRepository;
import flighttickets.AeroZip.repositories.PassengerRepository;
import flighttickets.AeroZip.repositories.PlaneTicketRepository;
import flighttickets.AeroZip.repositories.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PassengerRepository passengerRepository;
    private final FlightRepository flightRepository;
    private final PlaneTicketRepository planeTicketRepository;


    // creazione della prenotazione
    @Transactional
    public ReservationResponseDTO createReservation(ReservationRequestDTO requestDTO, User user) {
        Reservation reservation = new Reservation();
        reservation.setId(UUID.randomUUID());

        ReservationStatus status = isComplete(requestDTO)
                ? ReservationStatus.CONFIRMED
                : ReservationStatus.PENDING;
        reservation.setStatus(status);

        Flight departingFlight = flightRepository.findById(requestDTO.departingFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        reservation.setDepartingFlight(departingFlight);

        if (requestDTO.returningFlightId() != null) {
            Flight returningFlight = flightRepository.findById(requestDTO.returningFlightId())
                    .orElseThrow(() -> new RuntimeException("Flight not found"));

            reservation.setReturningFlight(returningFlight);
        }

        reservation.setUser(user);

        reservationRepository.save(reservation);

        List<PassengerResponseDTO> passengerResponses = processPassengers(requestDTO.passengers(), reservation);

        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getStatus().name(),
                passengerResponses
        );
    }


    // aggiornamento della prenotazione
    @Transactional
    public ReservationResponseDTO updateReservation(UUID id, ReservationRequestDTO requestDTO) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        ReservationStatus status = isComplete(requestDTO)
                ? ReservationStatus.CONFIRMED
                : ReservationStatus.PENDING;
        reservation.setStatus(status);


        List<PassengerResponseDTO> passengerResponses = processPassengers(requestDTO.passengers(), reservation);

        reservationRepository.save(reservation);

        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getStatus().name(),
                passengerResponses
        );
    }

    // assegnazione volo
    @Transactional
    public ReservationResponseDTO assignFlights(UUID id, FlightAssignmentDTO dto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Flight departing = flightRepository.findById(dto.departingFlightId())
                .orElseThrow(() -> new RuntimeException("Departing flight not found"));
        reservation.setDepartingFlight(departing);

        if (dto.returningFlightId() != null) {
            Flight returning = flightRepository.findById(dto.returningFlightId())
                    .orElseThrow(() -> new RuntimeException("Returning flight not found"));
            reservation.setReturningFlight(returning);
        }

        reservationRepository.save(reservation);

        return new ReservationResponseDTO(reservation.getId(), reservation.getStatus().name(), new ArrayList<>());
    }


    // aggiunta passeggerp
    @Transactional
    public ReservationResponseDTO addPassengers(UUID id, List<PassengerDTO> passengerDTOs) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        List<PassengerResponseDTO> passengerResponses = processPassengers(passengerDTOs, reservation);
        reservationRepository.save(reservation);

        return new ReservationResponseDTO(reservation.getId(), reservation.getStatus().name(), passengerResponses);
    }


    // aggiunta biglietto
    @Transactional
    public ReservationResponseDTO addTickets(UUID id, List<SeatDTO> seatDTOs) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        List<SeatResponseDTO> seatResponses = new ArrayList<>();
        for (SeatDTO seatDTO : seatDTOs) {
            Flight flight = flightRepository.findById(seatDTO.flightId())
                    .orElseThrow(() -> new RuntimeException("Flight not found"));

            Passenger passenger = passengerRepository.findByEmail(seatDTO.passengerMail())
                    .orElseThrow(() -> new RuntimeException("Passenger not found"));

            PlaneTicket ticket = planeTicketRepository
                    .findByPassengerIdAndFlightId(passenger.getId(), seatDTO.flightId())
                    .orElse(new PlaneTicket());

            ticket.setPassenger(passenger);
            ticket.setReservation(reservation);
            ticket.setFlight(flight);
            ticket.setSeat(seatDTO.seat());
            ticket.setSeatClass(SeatClass.valueOf(seatDTO.seatClass()));
            planeTicketRepository.save(ticket);

            seatResponses.add(new SeatResponseDTO(seatDTO.flightId(), seatDTO.seat(), seatDTO.seatClass()));
        }

        reservationRepository.save(reservation);

        return new ReservationResponseDTO(reservation.getId(), reservation.getStatus().name(), new ArrayList<>());
    }


    // delete
    @Transactional
    public void deleteReservation(UUID id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservationRepository.delete(reservation);
    }

    // cancellare un passeggero da una prenotazioen
    @Transactional
    public void deletePassengerFromReservation(UUID reservationId, String email) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Passenger passenger = passengerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        // Cancella i ticket associati a quel passeggero e reservation
        List<PlaneTicket> tickets = planeTicketRepository.findByPassengerIdAndReservationId(passenger.getId(), reservation.getId());
        planeTicketRepository.deleteAll(tickets);

        // Rimuovi il passeggero dalla reservation (se hai relazione diretta)
        reservation.getTickets().removeIf(ticket -> ticket.getPassenger().equals(passenger));

        reservationRepository.save(reservation);
    }


    private List<PassengerResponseDTO> processPassengers(List<PassengerDTO> passengerDTOs, Reservation reservation) {
        List<PassengerResponseDTO> passengerResponses = new ArrayList<>();

        if (passengerDTOs != null) {
            for (PassengerDTO passengerDTO : passengerDTOs) {
                // Cerca se esiste già un passeggero con quella Email
                Passenger passenger = passengerRepository.findByEmail(passengerDTO.mail())
                        .orElse(new Passenger());

                passenger.setName(passengerDTO.name());
                passenger.setSurname(passengerDTO.surname());
                passenger.setBirthdate(passengerDTO.birthDate());
                passenger.setEmail(passengerDTO.mail());
                passenger.setPhone(passengerDTO.phone());
                passenger.setBag(passengerDTO.baggageNumber());
                passengerRepository.save(passenger);

                List<SeatResponseDTO> seatResponses = new ArrayList<>();
                if (passengerDTO.seats() != null) {
                    for (SeatDTO seatDTO : passengerDTO.seats()) {
                        Flight flight = flightRepository.findById(seatDTO.flightId())
                                .orElseThrow(() -> new RuntimeException("Flight not found"));

                        // Cerca se esiste già un ticket per quel passeggero e volo
                        PlaneTicket ticket = planeTicketRepository
                                .findByPassengerIdAndFlightId(passenger.getId(), seatDTO.flightId())
                                .orElse(new PlaneTicket());
                        ticket.setPassenger(passenger);
                        ticket.setReservation(reservation);
                        ticket.setFlight(flight);
                        ticket.setSeat(seatDTO.seat());
                        ticket.setSeatClass(SeatClass.valueOf(seatDTO.seatClass()));
                        planeTicketRepository.save(ticket);

                        seatResponses.add(new SeatResponseDTO(
                                seatDTO.flightId(),
                                seatDTO.seat(),
                                seatDTO.seatClass()
                        ));
                    }
                }

                passengerResponses.add(new PassengerResponseDTO(
                        passenger.getName(),
                        passenger.getSurname(),
                        passenger.getEmail(),
                        seatResponses
                ));
            }
        }

        return passengerResponses;
    }

    @Transactional
    public ReservationSummaryDTO getReservationSummary(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // USER
        User user = reservation.getUser();
        UserMeDTO userDTO = new UserMeDTO(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getPhone(),
                user.getEmail()
        );

        // DEPARTING FLIGHT
        Flight departingFlight = reservation.getDepartingFlight();
        FlightDTO departingDTO = departingFlight != null ? new FlightDTO(
                departingFlight.getId(),
                departingFlight.getCompany(),
                departingFlight.getCompanyAvatar(),
                departingFlight.getFlightCode(),
                departingFlight.getFlightTime(),
                departingFlight.getLayover().name(),
                departingFlight.getDepartDate().atTime(departingFlight.getDepartureTime()).toString(),
                departingFlight.getDepartDate().atTime(departingFlight.getArrivalTime()).toString(),
                departingFlight.getCost() * 100,
                20000L,
                departingFlight.getDepartureAirport().getId(),
                departingFlight.getArrivalAirport().getId(),
                departingFlight.getDepartDate().toString()
        ) : null;

        // RETURNING FLIGHT
        Flight returningFlight = reservation.getReturningFlight();
        System.out.println("returningFlight");
        FlightDTO returningDTO = returningFlight != null ? new FlightDTO(
                returningFlight.getId(),
                returningFlight.getCompany(),
                returningFlight.getCompanyAvatar(),
                returningFlight.getFlightCode(),
                returningFlight.getFlightTime(),
                returningFlight.getLayover().name(),
                returningFlight.getDepartDate().atTime(returningFlight.getDepartureTime()).toString(),
                returningFlight.getDepartDate().atTime(returningFlight.getArrivalTime()).toString(),
                returningFlight.getCost() * 100,
                20000L,
                returningFlight.getDepartureAirport().getId(),
                returningFlight.getArrivalAirport().getId(),
                returningFlight.getDepartDate().toString()
        ) : null;
        System.out.println("after returningFlight");

        // PASSENGERS + TICKETS
        Map<UUID, PassengerWithTicketsDTO> passengerMap = new LinkedHashMap<>();

        System.out.println(reservation.getTickets());

        for (PlaneTicket ticket : reservation.getTickets()) {
            Passenger p = ticket.getPassenger();
            UUID passengerId = p.getId();

            System.out.println("passengerId " + passengerId);
            SeatResponseDTO seatDTO = new SeatResponseDTO(
                    ticket.getFlight().getId(),
                    ticket.getSeat(),
                    ticket.getSeatClass().name()
            );

            if (!passengerMap.containsKey(passengerId)) {
                passengerMap.put(passengerId, new PassengerWithTicketsDTO(
                        p.getName(),
                        p.getSurname(),
                        p.getEmail(),
                        p.getPhone(),
                        p.getBag(),
                        new ArrayList<>(List.of(seatDTO))
                ));
            } else {
                passengerMap.get(passengerId).tickets().add(seatDTO);
            }
        }

        System.out.println("pre passengers");
        List<PassengerWithTicketsDTO> passengers = new ArrayList<>(passengerMap.values());

        System.out.println("passengers " + passengers);

        return new ReservationSummaryDTO(
                reservation.getId(),
                reservation.getStatus().name(),
                userDTO,
                departingDTO,
                returningDTO,
                passengers
        );
    }


    private boolean isComplete(ReservationRequestDTO dto) {
        if (dto == null) return false;
        if (dto.departingFlightId() == null) return false; // solo il volo di partenza è obbligatorio
        if (dto.passengers() == null || dto.passengers().isEmpty()) return false;

        for (PassengerDTO p : dto.passengers()) {
            if (p.name() == null || p.surname() == null || p.birthDate() == null ||
                    p.mail() == null || p.phone() == null || p.seats() == null || p.seats().isEmpty()) {
                return false;
            }
            for (SeatDTO s : p.seats()) {
                if (s.flightId() == null || s.seat() == null || s.seatClass() == null) {
                    return false;
                }
            }
        }
        return true;
    }
}

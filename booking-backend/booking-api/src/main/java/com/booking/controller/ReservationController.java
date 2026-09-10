package com.booking.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.booking.dto.CreateReservationRequest;
import com.booking.model.Reservation;
import com.booking.repository.ReservationRepository;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(
            ReservationRepository reservationRepository
    ) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/me")
    public List<Reservation> getMyReservations(
            Authentication authentication
    ) {
        String email = authentication.getName();

        return reservationRepository.findByUserEmail(email);
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            @RequestBody CreateReservationRequest request,
            Authentication authentication
    ) {
        Reservation reservation = new Reservation();

        reservation.setMovieId(request.movieId());
        reservation.setTime(request.time());
        reservation.setSeats(request.seats());

        // Email pochodzi z wcześniej zweryfikowanego JWT.
        reservation.setUserEmail(authentication.getName());

        Reservation saved =
                reservationRepository.save(reservation);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Optional<Reservation> reservation =
                reservationRepository.findById(id);

        if (reservation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String authenticatedEmail = authentication.getName();

        if (!reservation.get()
                .getUserEmail()
                .equals(authenticatedEmail)) {

            return ResponseEntity.status(403)
                    .body("Brak uprawnień do usunięcia tej rezerwacji");
        }

        reservationRepository.delete(reservation.get());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/occupied")
    public ResponseEntity<List<Integer>> getOccupiedSeats(
            @RequestParam int movieId,
            @RequestParam String time
    ) {
        List<Reservation> reservations =
                reservationRepository.findByMovieIdAndTime(
                        movieId,
                        time
                );

        List<Integer> occupiedSeats =
                reservations.stream()
                        .flatMap(
                                reservation ->
                                        reservation
                                                .getSeats()
                                                .stream()
                        )
                        .collect(Collectors.toList());

        return ResponseEntity.ok(occupiedSeats);
    }
}
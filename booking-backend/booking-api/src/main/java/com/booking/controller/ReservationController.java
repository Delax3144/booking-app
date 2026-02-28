package com.booking.controller;

import com.booking.model.Reservation;
import com.booking.repository.ReservationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // Получение резерваций по почте пользователя
    @GetMapping("/user/{email}")
    public List<Reservation> getReservationsByUserEmail(@PathVariable String email) {
        return reservationRepository.findByUserEmail(email);
    }

    // Удаление резервации
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Reservation not found");
        }
        reservationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Сохранение новой резервации
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        Reservation saved = reservationRepository.save(reservation);
        return ResponseEntity.ok(saved);
    }

    // Получение занятых мест по фильму и времени
    @GetMapping("/occupied")
    public ResponseEntity<List<Integer>> getOccupiedSeats(
            @RequestParam int movieId,
            @RequestParam String time
    ) {
        List<Reservation> reservations = reservationRepository.findByMovieIdAndTime(movieId, time);
        List<Integer> occupiedSeats = reservations.stream()
                .flatMap(r -> r.getSeats().stream())
                .collect(Collectors.toList());
        return ResponseEntity.ok(occupiedSeats);
    }
}

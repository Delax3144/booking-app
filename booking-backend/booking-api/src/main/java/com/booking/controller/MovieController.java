package com.booking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.booking.model.Movie;
import com.booking.repository.MovieRepository;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private static final String ADMIN_EMAIL = "admin@gmail.com";

    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addMovie(
            @RequestBody Movie movie,
            Authentication authentication
    ) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Brak uprawnień administratora");
        }

        Movie savedMovie = movieRepository.save(movie);

        return ResponseEntity.ok(savedMovie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(
            @PathVariable Long id,
            Authentication authentication
    ) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Brak uprawnień administratora");
        }

        if (!movieRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        movieRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null
                && ADMIN_EMAIL.equalsIgnoreCase(authentication.getName());
    }
}
package com.booking.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.booking.dto.AuthResponse;
import com.booking.model.User;
import com.booking.repository.UserRepository;
import com.booking.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody User user) {

        if ("admin@gmail.com".equalsIgnoreCase(user.getEmail())) {
                return ResponseEntity.status(403)
                        .body("Rejestracja konta administratora jest niedozwolona");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body("Użytkownik już istnieje");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        String email = savedUser.getEmail();
        String token = jwtService.generateToken(email);

        return ResponseEntity.ok(
                new AuthResponse(email, token)
        );
        }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> found = userRepository.findByEmail(user.getEmail());

        if (found.isEmpty()
                || !passwordEncoder.matches(
                        user.getPassword(),
                        found.get().getPassword()
                )) {

            return ResponseEntity.status(401)
                    .body("Nieprawidłowy email lub hasło");
        }

        String email = found.get().getEmail();
        String token = jwtService.generateToken(email);

        return ResponseEntity.ok(
                new AuthResponse(email, token)
        );
    }
}
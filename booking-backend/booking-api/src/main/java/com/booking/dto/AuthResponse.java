package com.booking.dto;

public record AuthResponse(
        String email,
        String token
) {
}
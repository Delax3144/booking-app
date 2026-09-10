package com.booking.dto;

import java.util.List;

public record CreateReservationRequest(
        int movieId,
        String time,
        List<Integer> seats
) {
}
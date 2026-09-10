import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { apiFetch } from "../services/api";
import ReservationPage from "./ReservationPage";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("../services/api", () => ({
  apiFetch: jest.fn(),
}));

const originalFetch = globalThis.fetch;

describe("ReservationPage", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    useParams.mockReturnValue({
      movieId: "7",
      time: "18:30",
    });

    useNavigate.mockReturnValue(navigate);

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [2],
    });

    window.alert = jest.fn();

    navigate.mockClear();
    apiFetch.mockClear();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

    test("loads occupied seats and disables them", async () => {
    render(<ReservationPage />);

    expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/reservations/occupied?movieId=7&time=18:30"
    );

    const occupiedSeat = screen.getByRole(
        "button",
        { name: "2" }
    );

    await waitFor(() => {
        expect(occupiedSeat).toBeDisabled();
    });
    });

  test("submits reservation without userEmail", async () => {
    apiFetch.mockResolvedValue({
      ok: true,
    });

    render(<ReservationPage />);

    const seat = await screen.findByRole(
      "button",
      { name: "1" }
    );

    fireEvent.click(seat);

    const submitButton = screen.getByRole(
      "button",
      { name: /Zarezerwuj/ }
    );

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = apiFetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toBe("/api/reservations");

    expect(options.method).toBe("POST");

    expect(
      options.headers["Content-Type"]
    ).toBe("application/json");

    expect(body).toEqual({
      movieId: 7,
      time: "18:30",
      seats: [1],
    });

    expect(body).not.toHaveProperty("userEmail");

    expect(window.alert).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(
      "/moje-rezerwacje"
    );
  });

  test("does not navigate when reservation fails", async () => {
    apiFetch.mockResolvedValue({
      ok: false,
    });

    render(<ReservationPage />);

    const seat = await screen.findByRole(
      "button",
      { name: "1" }
    );

    fireEvent.click(seat);

    fireEvent.click(
      screen.getByRole(
        "button",
        { name: /Zarezerwuj/ }
      )
    );

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    expect(window.alert).toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
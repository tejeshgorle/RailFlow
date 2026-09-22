package com.railway.wagonmanagement.exception;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;



@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(WagonNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleWagonNotFound(
            WagonNotFoundException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(StationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleStationNotFound(
            StationNotFoundException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(InvalidMovementException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidMovement(
            InvalidMovementException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public List<String> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        return exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .toList();
    }

    @ExceptionHandler(DemandNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleDemandNotFound(
            DemandNotFoundException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(InvalidDemandStatusException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidDemandStatus(
            InvalidDemandStatusException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(InvalidWagonAllocationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidWagonAllocation(
            InvalidWagonAllocationException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(ConsignmentNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleConsignmentNotFound(
            ConsignmentNotFoundException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(CustomerNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleCustomerNotFound(
            CustomerNotFoundException exception) {

        return exception.getMessage();
    }
    @ExceptionHandler(RakeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleRakeNotFound(RakeNotFoundException exception) {
        return exception.getMessage();
    }

    @ExceptionHandler(InvalidRakeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidRake(InvalidRakeException exception) {
        return exception.getMessage();
    }

    @ExceptionHandler(InvalidConsignmentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidConsignment(
            InvalidConsignmentException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(InvalidDemandException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidDemand(
            InvalidDemandException exception) {

        return exception.getMessage();
    }
    @ExceptionHandler(InvalidCustomerException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidCustomer(
            InvalidCustomerException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(InvalidWagonException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidWagon(
            InvalidWagonException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(InvalidStationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidStation(
            InvalidStationException exception) {

        return exception.getMessage();
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(
            DataIntegrityViolationException ex) {

        return ResponseEntity
                .badRequest()
                .body(
                    "This record cannot be deleted because it is referenced by operational history."
                );
    }
}
package com.railway.wagonmanagement.exception;

public class ConsignmentNotFoundException extends RuntimeException {

    public ConsignmentNotFoundException(String message) {
        super(message);
    }
}
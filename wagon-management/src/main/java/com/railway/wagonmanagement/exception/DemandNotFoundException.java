package com.railway.wagonmanagement.exception;

public class DemandNotFoundException extends RuntimeException {

    public DemandNotFoundException(String message) {
        super(message);
    }
}
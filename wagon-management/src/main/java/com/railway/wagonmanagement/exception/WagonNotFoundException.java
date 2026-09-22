package com.railway.wagonmanagement.exception;

public class WagonNotFoundException extends RuntimeException {

    public WagonNotFoundException(String message) {
        super(message);
    }
}
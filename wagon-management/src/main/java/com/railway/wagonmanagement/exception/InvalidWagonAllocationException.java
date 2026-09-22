package com.railway.wagonmanagement.exception;

public class InvalidWagonAllocationException
        extends RuntimeException {

    public InvalidWagonAllocationException(String message) {
        super(message);
    }
}
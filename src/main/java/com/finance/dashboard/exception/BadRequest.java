package com.finance.dashboard.exception;

public class BadRequest extends RuntimeException{

    public BadRequest(String message) {
        super(message);
    }
}

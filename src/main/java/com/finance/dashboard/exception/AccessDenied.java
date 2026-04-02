package com.finance.dashboard.exception;

public class AccessDenied extends RuntimeException{

    public AccessDenied(String message) {
        super(message);
    }
}

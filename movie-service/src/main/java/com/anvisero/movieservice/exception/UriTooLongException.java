package com.anvisero.movieservice.exception;

public class UriTooLongException extends RuntimeException {
    public UriTooLongException(String message) {
        super(message);
    }
}

package com.anvisero.movieservice.exception;

import lombok.Getter;

@Getter
public class NumericFieldParseException extends RuntimeException {
    public NumericFieldParseException(String message) {
        super(message);
    }
}

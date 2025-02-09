package com.anvisero.oscar.exception;

import lombok.Getter;

@Getter
public class NumericFieldParseException extends RuntimeException {
    public NumericFieldParseException(String message) {
        super(message);
    }
}

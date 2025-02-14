package com.anvisero.movieservice.exception;

import lombok.Getter;

@Getter
public class FilterEnumValidationException extends RuntimeException {
    String fieldName;

    public FilterEnumValidationException(String fieldName, String message) {
        super(message);
        this.fieldName = fieldName;
    }
}

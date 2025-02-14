package com.anvisero.movieservice.exception;

import lombok.Getter;

@Getter
public class UnprocessibleEntityException extends RuntimeException {
    String field;

    public UnprocessibleEntityException(String field, String message) {
        super(message);
        this.field = field;
    }
}

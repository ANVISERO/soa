package com.anvisero.movieservice.exception.parse;

import lombok.Getter;

@Getter
public class ParsingException extends RuntimeException {
    String field;

    public ParsingException(String field, String message) {
        super(message);
        this.field = field;
    }
}

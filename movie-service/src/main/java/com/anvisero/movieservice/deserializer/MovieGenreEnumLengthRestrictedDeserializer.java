package com.anvisero.movieservice.deserializer;

import com.anvisero.movieservice.model.enums.MovieGenre;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;
import java.util.Arrays;

public class MovieGenreEnumLengthRestrictedDeserializer extends JsonDeserializer<MovieGenre> {

    private static final int MAX_LENGTH = 255;

    @Override
    public MovieGenre deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value.isEmpty()) {
            throw JsonMappingException.from(p,"Please specify the movie genre");
        }

        if (value.length() > MAX_LENGTH) {
            throw JsonMappingException.from(p,
                    "Value length exceeds maximum allowed limit of " + MAX_LENGTH + " characters");
        }

        try {
            return MovieGenre.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw JsonMappingException.from(p,
                    "Invalid value for MovieGenre: " + value + ". Allowed values: " + Arrays.toString(MovieGenre.values()));
        }
    }
}

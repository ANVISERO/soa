package com.anvisero.movieservice.deserializer;

import com.anvisero.movieservice.model.enums.Color;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;
import java.util.Arrays;

public class ColorEnumLengthRestrictedDeserializer extends JsonDeserializer<Color> {

    private static final int MAX_LENGTH = 255;

    @Override
    public Color deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value.isEmpty()) {
            return null;
//            throw JsonMappingException.from(p,"Please specify the movie screenwriter's hair color");
        }

        if (value.length() > MAX_LENGTH) {
            throw JsonMappingException.from(p,
                    "Value length exceeds maximum allowed limit of " + MAX_LENGTH + " characters");
        }

        try {
            return Color.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw JsonMappingException.from(p,
                    "Invalid value for Color: " + value + ". Allowed values: " + Arrays.toString(Color.values()));
        }
    }
}

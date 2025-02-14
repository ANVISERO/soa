package com.anvisero.oscar.deserializer;

import com.anvisero.oscar.dto.enums.Country;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;
import java.util.Arrays;

public class CountryEnumLengthRestrictedDeserializer extends JsonDeserializer<Country> {
    private static final int MAX_LENGTH = 255;

    @Override
    public Country deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value.isEmpty()) {
            return null;
        }

        if (value.length() > MAX_LENGTH) {
            throw JsonMappingException.from(p,
                    "Value length exceeds maximum allowed limit of " + MAX_LENGTH + " characters");
        }

        try {
            return Country.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw JsonMappingException.from(p,
                    "Invalid value for MovieGenre: " + value + ". Allowed values: " + Arrays.toString(Country.values()));
        }
    }
}

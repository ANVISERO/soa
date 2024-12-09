package com.anvisero.movieservice.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;

public class CoordinateYDeserializer extends JsonDeserializer<Integer> {

    private static final int MAX_LENGTH = 11;

    @Override
    public Integer deserialize(JsonParser p, DeserializationContext context) throws IOException {
        String value = p.getText();

        if (value.length() > MAX_LENGTH) {
            throw JsonMappingException.from(p,
                    "Value length exceeds maximum allowed limit of " + MAX_LENGTH + " characters");
        }

        try {
            int parsedValue = Integer.parseInt(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw JsonMappingException.from(p, "Invalid format for coordinate y. Expected a valid numeric value between -2,147,483,648 and 2,147,483,647.");
        }
    }
}

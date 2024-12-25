package com.anvisero.movieservice.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;

public class StringLengthRestrictedDeserializer extends JsonDeserializer<String> {
    private static final int MAX_LENGTH = 255;

    @Override
    public String deserialize(JsonParser p, DeserializationContext context) throws IOException {
        String value = p.getText();

        if (value.length() > MAX_LENGTH) {
            throw JsonMappingException.from(p,
                    "Value length exceeds maximum allowed limit of " + MAX_LENGTH + " characters");
        }

        return value;
    }
}

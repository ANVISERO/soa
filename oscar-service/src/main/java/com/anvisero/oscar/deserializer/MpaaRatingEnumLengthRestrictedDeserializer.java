package com.anvisero.oscar.deserializer;

import com.anvisero.oscar.dto.enums.MpaaRating;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;
import java.util.Arrays;

public class MpaaRatingEnumLengthRestrictedDeserializer extends JsonDeserializer<MpaaRating> {

    private static final int MAX_LENGTH = 255;

    @Override
    public MpaaRating deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value.isEmpty()) {
            throw JsonMappingException.from(p,"Please specify the mpaa rating");
        }

        if (value.length() > MAX_LENGTH) {
            throw JsonMappingException.from(p,
                    "Value length exceeds maximum allowed limit of " + MAX_LENGTH + " characters");
        }

        try {
            return MpaaRating.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw JsonMappingException.from(p,
                    "Invalid value for MpaaRating: " + value + ". Allowed values: " + Arrays.toString(MpaaRating.values()));
        }
    }
}

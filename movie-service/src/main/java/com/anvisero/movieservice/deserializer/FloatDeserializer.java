package com.anvisero.movieservice.deserializer;

import com.anvisero.movieservice.exception.NumericFieldParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;

public class FloatDeserializer extends JsonDeserializer<Float> {


    private static final double MIN_VALUE = -2_147_483_648;
    private static final double MAX_VALUE = 2_147_483_647;
    private static final int MAX_LENGTH = 255;

    @Override
    public Float deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        String fieldName = ctxt.getParser().currentName();
        String parentField = p.getParsingContext().getParent() != null
                ? p.getParsingContext().getParent().getCurrentName()
                : null;

        String fieldFullName = parentField != null ? parentField + "." + fieldName : fieldName;
        if (value.isEmpty()) {
            throw JsonMappingException.from(p,"Please specify " + fieldFullName + " value");
        }

        if (value.length() > MAX_LENGTH) {
            throw JsonMappingException.from(p,
                    "Value length exceeds maximum allowed limit of " + MAX_LENGTH + " characters");
        }

        try {
            float parsedValue = Float.parseFloat(value);
            if (parsedValue < MIN_VALUE || parsedValue > MAX_VALUE) {
                throw new NumericFieldParseException(fieldFullName + " must be between -2,147,483,648 and 2,147,483,647.");
            }
            return parsedValue;
        } catch (NumberFormatException e) {
            throw JsonMappingException.from(p, "Invalid format for " + fieldFullName + ". Expected a valid numeric value between -2,147,483,648 and 2,147,483,647.");
        }
    }
}
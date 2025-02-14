package com.anvisero.movieservice.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;

public class LongDeserializer extends JsonDeserializer<Long> {

    @Override
    public Long deserialize(JsonParser p, DeserializationContext context) throws IOException {
        String value = p.getText();
        String fieldName = context.getParser().currentName();
        String parentField = p.getParsingContext().getParent() != null
                ? p.getParsingContext().getParent().getCurrentName()
                : null;

        String fieldFullName = parentField != null ? parentField + "." + fieldName : fieldName;


        try {
            Long parsedValue = Long.parseLong(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw JsonMappingException.from(p, "Invalid format for " + fieldFullName + ". Expected a valid numeric value between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807.");
        }
    }
}
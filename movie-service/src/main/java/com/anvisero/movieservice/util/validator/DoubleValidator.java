package com.anvisero.movieservice.util.validator;

import com.anvisero.movieservice.dto.enums.FieldType;
import com.anvisero.movieservice.exception.UnprocessibleEntityException;
import com.anvisero.movieservice.exception.parse.ParsingException;

import java.math.BigDecimal;

public class DoubleValidator {
    public static Double validateDoubleValue(BigDecimal value, FieldType fieldType) {
        double MIN_VALUE = -2_147_483_648.0;
        double MAX_VALUE = 2_147_483_647.0;
        final int MAX_SCALE = 5;

        try {
            if (value == null) {
                throw new ParsingException(fieldType.toString(),
                        String.format("Invalid format for %s. Value cannot be null.", fieldType.toString()));
            }

            double parsedValue = value.doubleValue();

            if (parsedValue < MIN_VALUE || parsedValue > MAX_VALUE) {
                throw new UnprocessibleEntityException(fieldType.toString(),
                        String.format("Value out of range for %s. Expected a value between -2,147,483,648 and 2,147,483,647.",
                                fieldType.toString()));
            }

            int scale = value.stripTrailingZeros().scale();
            if (scale > MAX_SCALE) {
                throw new UnprocessibleEntityException(fieldType.toString(),
                        String.format("Invalid precision for %s. Maximum 5 decimal places allowed.",
                                fieldType.toString()));
            }

            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(),
                    String.format("Invalid format for %s. Expected a valid numeric value.",
                            fieldType.toString()));
        }
    }

    public static Float validateFloatValue(BigDecimal value, FieldType fieldType) {
        double MIN_VALUE = 0;
        double MAX_VALUE = 2_147_483_647.0;
        final int MAX_SCALE = 5;

        try {
            if (value == null) {
                throw new ParsingException(fieldType.toString(),
                        String.format("Invalid format for %s. Value cannot be null.", fieldType.toString()));
            }

            float parsedValue = value.floatValue();

            if (parsedValue <= MIN_VALUE || parsedValue > MAX_VALUE) {
                throw new UnprocessibleEntityException(fieldType.toString(),
                        String.format("Value out of range for %s. Expected a value between 0 (not included) and 2,147,483,647.",
                                fieldType.toString()));
            }

            int scale = value.stripTrailingZeros().scale();
            if (scale > MAX_SCALE) {
                throw new UnprocessibleEntityException(fieldType.toString(),
                        String.format("Invalid precision for %s. Maximum 5 decimal places allowed.",
                                fieldType.toString()));
            }

            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(),
                    String.format("Invalid format for %s. Expected a valid numeric value.",
                            fieldType.toString()));
        }
    }
}

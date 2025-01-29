package com.anvisero.movieservice.util.validator;

import com.anvisero.movieservice.dto.Filter;
import com.anvisero.movieservice.dto.FilterRequest;
import com.anvisero.movieservice.dto.enums.FieldType;
import com.anvisero.movieservice.dto.enums.FilterType;
import com.anvisero.movieservice.exception.parse.ParsingException;
import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.model.enums.Country;
import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import lombok.experimental.UtilityClass;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@UtilityClass
public class SearchRequestValidator {
    public void validateSearchRequest(@Validated FilterRequest movieRequest) {
        List<Filter> filters = movieRequest.getFilters();
        if (filters != null && !filters.isEmpty()) {
            for (int i = 0; i < filters.size(); i++) {
                validateFilterValue(filters.get(i), i);
            }
            System.out.println(movieRequest);
        }
    }

    private void validateFilterValue(Filter filter, int i) {
        FieldType field = filter.getField();
        FilterType filterType = filter.getFilterType();
        String value = filter.getValue();
        if (field == FieldType.ID) {
            Long id = validateLongValue(value, FieldType.ID, i);
        } else if (field == FieldType.OSCARS_COUNT) {
            Long oscarsCount = validateLongValue(value, FieldType.OSCARS_COUNT, i);
        } else if (field == FieldType.COORDINATE_Y) {
            Integer y = validateIntegerValue(value, FieldType.COORDINATE_Y, i);
        } else if (field == FieldType.DURATION) {
            Integer duration = validateIntegerValue(value, FieldType.DURATION, i);
        } else if (field == FieldType.COORDINATE_X) {
            Double x = validateDoubleValue(value, FieldType.COORDINATE_X, i);
        } else if (field == FieldType.SCREENWRITER_HEIGHT) {
            Float height = validateFloatValue(value, FieldType.SCREENWRITER_HEIGHT, i);
        }
    }

    private Long validateLongValue(String value, FieldType fieldType, int i) {
        try {
            Long parsedValue = Long.parseLong(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(), String.format("Invalid format for filters[%d].%s. Expected a valid numeric value between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807.", i, fieldType.toString()));
        }
    }

    private Integer validateIntegerValue(String value, FieldType fieldType, int i) {
        try {
            Integer parsedValue = Integer.parseInt(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(), String.format("Invalid format for filters[%d].%s. Expected a valid numeric value between -2,147,483,648 and 2,147,483,647.", i, fieldType.toString()));
        }
    }

    private Double validateDoubleValue(String value, FieldType fieldType, int i) {
        try {
            Double parsedValue = Double.parseDouble(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(), String.format("Invalid format for filters[%d].%s. Expected a valid numeric value between -2,147,483,648 and 2,147,483,647.", i, fieldType.toString()));
        }
    }

    private Float validateFloatValue(String value, FieldType fieldType, int i) {
        try {
            Float parsedValue = Float.parseFloat(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(), String.format("Invalid format for filters[%d].%s. Expected a valid numeric value between -2,147,483,648 and 2,147,483,647.", i, fieldType.toString()));
        }
    }

    private MovieGenre validateMovieGenreValue(String value, FieldType fieldType, int i) {
        try {
            return MovieGenre.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new ParsingException(fieldType.toString(), "Invalid value for MovieGenre: " + value + ". Allowed values: " + Arrays.toString(MovieGenre.values()));
        }
    }

    private MpaaRating validateMpaaRatingValue(String value, FieldType fieldType, int i) {
        try {
            return MpaaRating.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new ParsingException(fieldType.toString(), "Invalid value for MpaaRating: " + value + ". Allowed values: " + Arrays.toString(MpaaRating.values()));
        }
    }

    private Color validateColorValue(String value, FieldType fieldType, int i) {
        try {
            return Color.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new ParsingException(fieldType.toString(), "Invalid value for Color: " + value + ". Allowed values: " + Arrays.toString(Color.values()));
        }
    }

    private Country validateCountryValue(String value, FieldType fieldType, int i) {
        try {
            return Country.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new ParsingException(fieldType.toString(), "Invalid value for Country: " + value + ". Allowed values: " + Arrays.toString(Country.values()));
        }
    }

    private LocalDate validateLocalDateValue(String value, FieldType fieldType, int i) {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return LocalDate.parse(value, dtf);
        } catch (IllegalArgumentException e) {
            throw new ParsingException(fieldType.toString(), "Invalid value for LocalDate: " + value + ". Allowed values: ");
        }
    }
}

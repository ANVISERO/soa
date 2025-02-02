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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
            Float screenwriterHeight = validateFloatValue(value, FieldType.SCREENWRITER_HEIGHT, i);
        } else if (field == FieldType.SCREENWRITER_BIRTHDAY) {
            LocalDate screenwriterBirthday = validateLocalDateValue(value, FieldType.SCREENWRITER_BIRTHDAY, i);
        } else if (field == FieldType.GENRE) {
            MovieGenre genre = validateMovieGenreValue(value, FieldType.GENRE, i);
        } else if (field == FieldType.MPAA_RATING) {
            MpaaRating mpaaRating = validateMpaaRatingValue(value, FieldType.MPAA_RATING, i);
        } else if (field == FieldType.CREATION_DATE) {
            LocalDateTime creationDate = validateLocalDateTimeValue(value, FieldType.CREATION_DATE, i);
        } else if (field == FieldType.SCREENWRITER_HAIR_COLOR) {
            Color hairColor = validateColorValue(value, FieldType.SCREENWRITER_HAIR_COLOR, i);
        } else if (field == FieldType.SCREENWRITER_NATIONALITY) {
            Country nationality = validateCountryValue(value, FieldType.SCREENWRITER_NATIONALITY, i);
        }
    }

    private Long validateLongValue(String value, FieldType fieldType, int i) {
        try {
            Long parsedValue = Long.parseLong(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(), String.format("Invalid format for filters[%d].%s. Expected an integer number between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807.", i, fieldType.toString()));
        }
    }

    private Integer validateIntegerValue(String value, FieldType fieldType, int i) {
        try {
            Integer parsedValue = Integer.parseInt(value);
            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(), String.format("Invalid format for filters[%d].%s. Expected an integer number between -2,147,483,648 and 2,147,483,647.", i, fieldType.toString()));
        }
    }

    public static Double validateDoubleValue(String value, FieldType fieldType, int index) {
        double MIN_VALUE = -2_147_483_648.0;
        double MAX_VALUE = 2_147_483_647.0;
        final int MAX_SCALE = 5;

        try {
            Double parsedValue = Double.parseDouble(value);

            if (parsedValue < MIN_VALUE || parsedValue > MAX_VALUE) {
                throw new ParsingException(fieldType.toString(),
                        String.format("Value out of range for filters[%d].%s. Expected a value between -2,147,483,648 and 2,147,483,647.",
                                index, fieldType.toString()));
            }

            BigDecimal bd = new BigDecimal(value);
            int scale = bd.stripTrailingZeros().scale();
            if (scale > MAX_SCALE) {
                throw new ParsingException(fieldType.toString(),
                        String.format("Invalid precision for filters[%d].%s. Maximum 5 decimal places allowed.",
                                index, fieldType.toString()));
            }

            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(),
                    String.format("Invalid format for filters[%d].%s. Expected a valid numeric value.",
                            index, fieldType.toString()));
        }
    }

    public static Float validateFloatValue(String value, FieldType fieldType, int index) {
        double MIN_VALUE = -2_147_483_648.0;
        double MAX_VALUE = 2_147_483_647.0;
        final int MAX_SCALE = 5;

        try {
            Float parsedValue = Float.parseFloat(value);

            if (parsedValue < MIN_VALUE || parsedValue > MAX_VALUE) {
                throw new ParsingException(fieldType.toString(),
                        String.format("Value out of range for filters[%d].%s. Expected a value between -2,147,483,648 and 2,147,483,647.",
                                index, fieldType.toString()));
            }

            BigDecimal bd = new BigDecimal(value);
            int scale = bd.stripTrailingZeros().scale();
            if (scale > MAX_SCALE) {
                throw new ParsingException(fieldType.toString(),
                        String.format("Invalid precision for filters[%d].%s. Maximum 5 decimal places allowed.",
                                index, fieldType.toString()));
            }

            return parsedValue;
        } catch (NumberFormatException e) {
            throw new ParsingException(fieldType.toString(),
                    String.format("Invalid format for filters[%d].%s. Expected a valid numeric value.",
                            index, fieldType.toString()));
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
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return LocalDate.parse(value, dtf);
        } catch (IllegalArgumentException e) {
            throw new ParsingException(fieldType.toString(), "Invalid value for screenwriter birthday: " + value + ". Allowed format: dd-MM-yyyy");
        }
    }

    private static LocalDateTime validateLocalDateTimeValue(String value, FieldType fieldType, int i) {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            return LocalDateTime.parse(value, dtf);
        } catch (IllegalArgumentException e) {
            throw new ParsingException(fieldType.toString(), "Invalid value for creation date: " + value + ". Allowed format: yyyy-MM-ddTHH:mm:ss");
        }
    }
}

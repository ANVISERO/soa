package com.anvisero.movieservice.repository;

import com.anvisero.movieservice.dto.Filter;
import com.anvisero.movieservice.model.Movie;
import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.model.enums.Country;
import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DatePath;
import com.querydsl.core.types.dsl.EnumPath;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.core.types.dsl.StringPath;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;

import static com.anvisero.movieservice.dto.enums.FieldType.COORDINATE_X;
import static com.anvisero.movieservice.dto.enums.FieldType.COORDINATE_Y;
import static com.anvisero.movieservice.dto.enums.FieldType.DURATION;
import static com.anvisero.movieservice.dto.enums.FieldType.GENRE;
import static com.anvisero.movieservice.dto.enums.FieldType.ID;
import static com.anvisero.movieservice.dto.enums.FieldType.MPAA_RATING;
import static com.anvisero.movieservice.dto.enums.FieldType.OSCARS_COUNT;
import static com.anvisero.movieservice.dto.enums.FieldType.SCREENWRITER_BIRTHDAY;
import static com.anvisero.movieservice.dto.enums.FieldType.SCREENWRITER_HAIR_COLOR;
import static com.anvisero.movieservice.dto.enums.FieldType.SCREENWRITER_HEIGHT;
import static com.anvisero.movieservice.dto.enums.FieldType.SCREENWRITER_NATIONALITY;

@AllArgsConstructor
public class MoviePredicate {
    private Filter filter;

    public BooleanExpression getPredicate() {
        PathBuilder<Movie> entityPath = new PathBuilder<>(Movie.class, "movie");

        if (isInteger(filter.getValue().toString()) && (filter.getField() == DURATION || filter.getField() == COORDINATE_Y)) {
            NumberPath<Integer> path = entityPath.getNumber(filter.getField().toString(), Integer.class);
            int value = Integer.parseInt(filter.getValue().toString());
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
                case GT:
                    return path.gt(value);
                case GTE:
                    return path.goe(value);
                case LT:
                    return path.lt(value);
                case LTE:
                    return path.loe(value);
            }
        } else if (isLong(filter.getValue().toString()) && (filter.getField() == OSCARS_COUNT || filter.getField() == ID)) {
            NumberPath<Long> path = entityPath.getNumber(filter.getField().toString(), Long.class);
            long value = Long.parseLong(filter.getValue().toString());
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
                case GT:
                    return path.gt(value);
                case GTE:
                    return path.goe(value);
                case LT:
                    return path.lt(value);
                case LTE:
                    return path.loe(value);
            }
        } else if (isFloat(filter.getValue().toString()) && filter.getField() == SCREENWRITER_HEIGHT) {
            NumberPath<Float> path = entityPath.getNumber(filter.getField().toString(), Float.class);
            float value = Float.parseFloat(filter.getValue().toString());
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
                case GT:
                    return path.gt(value);
                case GTE:
                    return path.goe(value);
                case LT:
                    return path.lt(value);
                case LTE:
                    return path.loe(value);
            }
        } else if (isDouble(filter.getValue().toString()) && filter.getField() == COORDINATE_X) {
            NumberPath<Double> path = entityPath.getNumber(filter.getField().toString(), Double.class);
            double value = Double.parseDouble(filter.getValue().toString());
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
                case GT:
                    return path.gt(value);
                case GTE:
                    return path.goe(value);
                case LT:
                    return path.lt(value);
                case LTE:
                    return path.loe(value);
            }
        } else if (filter.getField() == SCREENWRITER_BIRTHDAY && isLocalDate(filter.getValue().toString())) {
            DatePath<LocalDate> path = entityPath.getDate(filter.getField().toString(), LocalDate.class);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate value = LocalDate.parse(filter.getValue().toString(), formatter);
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
                case GT:
                    return path.gt(value);
                case GTE:
                    return path.goe(value);
                case LT:
                    return path.lt(value);
                case LTE:
                    return path.loe(value);
            }
        } else if (filter.getField() == GENRE) {
            EnumPath<MovieGenre> path = entityPath.getEnum(filter.getField().toString(), MovieGenre.class);
            MovieGenre value;
            try {
                value = MovieGenre.valueOf(filter.getValue());
            } catch (IllegalArgumentException iae) {
                throw new IllegalArgumentException("Invalid value for MovieGenre: " + filter.getValue() + ". Allowed values: " + Arrays.toString(MovieGenre.values()));
            }
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
            }
        } else if (filter.getField() == MPAA_RATING) {
            EnumPath<MpaaRating> path = entityPath.getEnum(filter.getField().toString(), MpaaRating.class);
            MpaaRating value = MpaaRating.valueOf(filter.getValue());
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
            }
        } else if (filter.getField() == SCREENWRITER_HAIR_COLOR) {
            EnumPath<Color> path = entityPath.getEnum(filter.getField().toString(), Color.class);
            System.out.println(path);
            Color value = Color.valueOf(filter.getValue());
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
            }
        } else if (filter.getField() == SCREENWRITER_NATIONALITY) {
            EnumPath<Country> path = entityPath.getEnum(filter.getField().toString(), Country.class);
            System.out.println(path);
            Country value = Country.valueOf(filter.getValue());
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
            }
        } else {
            StringPath path = entityPath.getString(filter.getField().toString());
            System.out.println(path);
            String value = filter.getValue();
            switch (filter.getFilterType()) {
                case EQ:
                    return path.eq(value);
                case NE:
                    return path.ne(value);
                case SUBSTR:
                    return path.containsIgnoreCase(value);
            }
        }
        return null;
    }

    public static boolean isInteger(final String str) {
        try {
            Integer.parseInt(str);
        } catch (final NumberFormatException e) {
            return false;
        }
        return true;
    }

    public static boolean isDouble(final String str) {
        try {
            Double.parseDouble(str);
        } catch (final NumberFormatException e) {
            return false;
        }
        return true;
    }

    public static boolean isLong(final String str) {
        try {
            Long.parseLong(str);
        } catch (final NumberFormatException e) {
            return false;
        }
        return true;
    }

    public static boolean isFloat(final String str) {
        try {
            Float.parseFloat(str);
        } catch (final NumberFormatException e) {
            return false;
        }
        return true;
    }

    public static boolean isLocalDate(final String str) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate.parse(str, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Invalid date format: " + str);
            return false;
        }
        return true;
    }
}

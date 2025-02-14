package com.anvisero.movieservice.repository;

import com.anvisero.movieservice.dto.Filter;
import com.anvisero.movieservice.exception.FilterEnumValidationException;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

public class MoviePredicatesBuilder {
    private List<Filter> params;

    public MoviePredicatesBuilder() {
        params = new ArrayList<>();
    }

    public MoviePredicatesBuilder with(Filter filter) {
        params.add(new Filter(filter.getField(), filter.getFilterType(), filter.getValue()));
        return this;
    }

    public BooleanExpression build() {
        if (params.isEmpty()) {
            return null;
        }

        final List<BooleanExpression> predicates = IntStream.range(0, params.size())
                .mapToObj(index -> {
                    MoviePredicate predicate = new MoviePredicate(params.get(index));
                    BooleanExpression booleanExpression;
                    try {
                        booleanExpression = predicate.getPredicate();
                    } catch (IllegalArgumentException e) {
                        throw new FilterEnumValidationException(
                                "filters[" + index + "].value", e.getMessage());
                    }
                    return booleanExpression;
                })
                .filter(Objects::nonNull)
                .toList();


        BooleanExpression result = Expressions.asBoolean(true).isTrue();
        for (BooleanExpression predicate : predicates) {
            result = result.and(predicate);
        }

        return result;
    }
}

package com.anvisero.movieservice.util.mapper;

import com.anvisero.movieservice.dto.CoordinatesDto;
import com.anvisero.movieservice.model.Coordinates;
import lombok.experimental.UtilityClass;

import java.math.BigDecimal;

@UtilityClass
public class CoordinatesMapper {

    public Coordinates coordinatesRequestToCoordinates(CoordinatesDto coordinatesDto, Double x) {
        if (coordinatesDto == null) {
            return null;
        }

        Coordinates.CoordinatesBuilder coordinates = Coordinates.builder();

        if (coordinatesDto.getX() != null) {
            coordinates.x(x);
        }
        if (coordinatesDto.getY() != null) {
            coordinates.y(coordinatesDto.getY());
        }

        return coordinates.build();
    }

    public CoordinatesDto coordinatesToCoordinatesResponse(Coordinates coordinates) {
        if (coordinates == null) {
            return null;
        }

        CoordinatesDto coordinatesDto = new CoordinatesDto();

        coordinatesDto.setX(BigDecimal.valueOf(coordinates.getX()));
        coordinatesDto.setY(coordinates.getY());

        return coordinatesDto;
    }
}

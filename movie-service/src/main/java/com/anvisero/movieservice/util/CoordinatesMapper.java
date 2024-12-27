package com.anvisero.movieservice.util;

import com.anvisero.movieservice.dto.CoordinatesDto;
import com.anvisero.movieservice.model.Coordinates;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CoordinatesMapper {

    public Coordinates coordinatesRequestToCoordinates(CoordinatesDto coordinatesDto) {
        if (coordinatesDto == null) {
            return null;
        }

        Coordinates.CoordinatesBuilder coordinates = Coordinates.builder();

        if (coordinatesDto.getX() != null) {
            coordinates.x(coordinatesDto.getX());
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

        coordinatesDto.setX(coordinates.getX());
        coordinatesDto.setY(coordinates.getY());

        return coordinatesDto;
    }
}

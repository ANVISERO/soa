package com.anvisero.movieservice.mapper;

import com.anvisero.movieservice.dto.CoordinatesDto;
import com.anvisero.movieservice.model.Coordinates;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CoordinatesMapper {
    Coordinates coordinatesRequestToCoordinates(CoordinatesDto coordinatesDto);

    CoordinatesDto coordinatesToCoordinatesResponse(Coordinates coordinates);
}

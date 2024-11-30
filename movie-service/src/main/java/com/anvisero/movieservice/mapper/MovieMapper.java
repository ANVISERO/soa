package com.anvisero.movieservice.mapper;

import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.model.Movie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CoordinatesMapper.class, PersonMapper.class})
public interface MovieMapper {
    Movie movieRequestToMovie(MovieDto movieDto);

    MovieDto movieToMovieResponse(Movie movie);
}

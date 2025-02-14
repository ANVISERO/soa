package com.anvisero.movieservice.util.mapper;

import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.dto.MovieDtoResponse;
import com.anvisero.movieservice.model.Movie;
import lombok.experimental.UtilityClass;

@UtilityClass
public class MovieMapper {

    public Movie movieRequestToMovie(MovieDto movieDto, Double x, Float height) {
        if (movieDto == null) {
            return null;
        }

        Movie.MovieBuilder movie = Movie.builder();

        movie.id(movieDto.getId());
        movie.name(movieDto.getName());
        movie.coordinates(CoordinatesMapper.coordinatesRequestToCoordinates(movieDto.getCoordinates(), x));
        if (movieDto.getOscarsCount() != null) {
            movie.oscarsCount(movieDto.getOscarsCount());
        }
        movie.genre(movieDto.getGenre());
        movie.mpaaRating(movieDto.getMpaaRating());
        movie.screenwriter(PersonMapper.personRequestToPerson(movieDto.getScreenwriter(), height));
        movie.duration(movieDto.getDuration());

        return movie.build();
    }

    public MovieDtoResponse movieToMovieResponse(Movie movie) {
        if (movie == null) {
            return null;
        }

        MovieDtoResponse movieDto = new MovieDtoResponse();

        movieDto.setId(movie.getId());
        movieDto.setName(movie.getName());
        movieDto.setCoordinates(CoordinatesMapper.coordinatesToCoordinatesResponse(movie.getCoordinates()));
        movieDto.setCreationDate(movie.getCreationDate());
        movieDto.setOscarsCount(movie.getOscarsCount());
        movieDto.setGenre(movie.getGenre());
        movieDto.setMpaaRating(movie.getMpaaRating());
        movieDto.setScreenwriter(PersonMapper.personToPersonResponse(movie.getScreenwriter()));
        movieDto.setDuration(movie.getDuration());

        return movieDto;
    }
}

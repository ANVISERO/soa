package com.anvisero.movieservice.util;

import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.model.Movie;
import lombok.experimental.UtilityClass;

@UtilityClass
public class MovieMapper {

    public Movie movieRequestToMovie(MovieDto movieDto) {
        if (movieDto == null) {
            return null;
        }

        Movie.MovieBuilder movie = Movie.builder();

        movie.id(movieDto.getId());
        movie.name(movieDto.getName());
        movie.coordinates(CoordinatesMapper.coordinatesRequestToCoordinates(movieDto.getCoordinates()));
        if (movieDto.getOscarsCount() != null) {
            movie.oscarsCount(movieDto.getOscarsCount());
        }
        movie.genre(movieDto.getGenre());
        movie.mpaaRating(movieDto.getMpaaRating());
        movie.screenwriter(PersonMapper.personRequestToPerson(movieDto.getScreenwriter()));
        movie.duration(movieDto.getDuration());

        return movie.build();
    }

    public MovieDto movieToMovieResponse(Movie movie) {
        if (movie == null) {
            return null;
        }

        MovieDto movieDto = new MovieDto();

        movieDto.setId(movie.getId());
        movieDto.setName(movie.getName());
        movieDto.setCoordinates(CoordinatesMapper.coordinatesToCoordinatesResponse(movie.getCoordinates()));
        movieDto.setOscarsCount(movie.getOscarsCount());
        movieDto.setGenre(movie.getGenre());
        movieDto.setMpaaRating(movie.getMpaaRating());
        movieDto.setScreenwriter(PersonMapper.personToPersonResponse(movie.getScreenwriter()));
        movieDto.setDuration(movie.getDuration());

        return movieDto;
    }
}

package com.anvisero.movieservice.service;

import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.mapper.MovieMapper;
import com.anvisero.movieservice.model.Movie;
import org.springframework.stereotype.Service;

@Service
public class MovieService {
    private final MovieMapper movieMapper;

    public MovieService(MovieMapper movieMapper) {
        this.movieMapper = movieMapper;
    }

    public MovieDto addMovie(MovieDto movieDto) {
        System.out.println(movieDto.getCoordinates());
        System.out.println(movieDto.getScreenwriter());
        Movie movie = movieMapper.movieRequestToMovie(movieDto);
        movie.setId(1L);
        System.out.println(movie.getCoordinates());
        System.out.println(movie.getScreenwriter());
        MovieDto movieDto1 = movieMapper.movieToMovieResponse(movie);
        System.out.println(movieDto1.getCoordinates());
        System.out.println(movieDto1.getScreenwriter());
        return movieDto1;
    }
}

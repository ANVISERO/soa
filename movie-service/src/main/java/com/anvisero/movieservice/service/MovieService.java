package com.anvisero.movieservice.service;

import com.anvisero.movieservice.dto.Filter;
import com.anvisero.movieservice.dto.FilterRequest;
import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.dto.SearchResponse;
import com.anvisero.movieservice.mapper.MovieMapper;
import com.anvisero.movieservice.model.Coordinates;
import com.anvisero.movieservice.model.Movie;
import com.anvisero.movieservice.model.Person;
import com.anvisero.movieservice.model.QMovie;
import com.anvisero.movieservice.repository.MoviePredicatesBuilder;
import com.anvisero.movieservice.repository.MovieRepository;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPAExpressions;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.anvisero.movieservice.dto.enums.SortingType.ASC;

@Slf4j
@Service
public class MovieService {
    private final MovieMapper movieMapper;
    private final MovieRepository movieRepository;

    public MovieService(MovieMapper movieMapper, MovieRepository movieRepository) {
        this.movieMapper = movieMapper;
        this.movieRepository = movieRepository;
    }

    @Transactional
    public MovieDto addMovie(MovieDto movieDto) {
        Movie movie = movieRepository.save(movieMapper.movieRequestToMovie(movieDto));
        MovieDto movieDtoResponse = movieMapper.movieToMovieResponse(movie);
        return movieDtoResponse;
    }

    @Transactional(readOnly = true)
    public MovieDto getMovieById(Long movieId) {
        Movie movie = movieRepository.getReferenceById(movieId);
        MovieDto movieDtoResponse = movieMapper.movieToMovieResponse(movie);
        return movieDtoResponse;
    }

    @Transactional
    public MovieDto updateMovie(Long movieId, MovieDto movieDto) {
        Movie movie = movieRepository.getReferenceById(movieId);

        movie.setName(movieDto.getName());
        movie.setCoordinates(Coordinates.builder()
                .x(movieDto.getCoordinates().getX())
                .y(movieDto.getCoordinates().getY())
                .build());
        movie.setOscarsCount(movieDto.getOscarsCount());
        movie.setGenre(movieDto.getGenre());
        movie.setMpaaRating(movieDto.getMpaaRating());
        movie.setScreenwriter(Person.builder()
                .name(movieDto.getScreenwriter().getName())
                .birthday(movieDto.getScreenwriter().getBirthday())
                .height(movieDto.getScreenwriter().getHeight())
                .hairColor(movieDto.getScreenwriter().getHairColor())
                .nationality(movieDto.getScreenwriter().getNationality())
                .build());
        movie.setDuration(movieDto.getDuration());

        Movie savedMovie = movieRepository.save(movie);
        MovieDto movieDtoResponse = movieMapper.movieToMovieResponse(savedMovie);
        return movieDtoResponse;
    }

    @Transactional
    public void deleteMovieById(Long movieId) {
        boolean exists = movieRepository.existsById(movieId);
        if (!exists) {
            throw new EntityNotFoundException("Movie with ID " + movieId + " does not exist");
        }
        movieRepository.deleteById(movieId);
    }

    public SearchResponse search(FilterRequest movieRequest) {
        List<Filter> filters = movieRequest.getFilters();
        MoviePredicatesBuilder moviePredicatesBuilder;
        List<Sort.Order> orders = null;
        if (movieRequest.getSortings() != null && !movieRequest.getSortings().isEmpty()) {
            orders = movieRequest.getSortings().stream()
                    .filter(obj -> Objects.nonNull(obj) && obj.getType() != null && obj.getField() != null)
                    .map(sorting -> new Sort.Order(
                            sorting.getType() == ASC ? Sort.Direction.ASC : Sort.Direction.DESC, sorting.getField().toString()
                    ))
                    .toList();
        }
        Pageable pageable;
        if (orders != null) {
            pageable = PageRequest.of(movieRequest.getPage(), movieRequest.getPageSize(), Sort.by(orders));
        } else {
            pageable = PageRequest.of(movieRequest.getPage(), movieRequest.getPageSize());
        }
        Page<Movie> moviePage;
        if (movieRequest.getFilters() == null || movieRequest.getFilters().isEmpty()) {
            moviePage = movieRepository.findAll(pageable);
        } else {
            moviePredicatesBuilder = new MoviePredicatesBuilder();
            for (Filter filter : filters) {
                moviePredicatesBuilder.with(filter);
            }
            moviePage = movieRepository.findAll(moviePredicatesBuilder.build(), pageable);
        }

        List<MovieDto> movieDtos = moviePage.getContent().stream()
                .map(movieMapper::movieToMovieResponse)
                .collect(Collectors.toList());

        int totalPages = moviePage.getTotalPages();

        return new SearchResponse(movieDtos, totalPages);
    }

    public MovieDto getScreenwriterMax() {
        QMovie movie = QMovie.movie;

        Predicate maxHeightPredicate = movie.screenwriter.height.eq(
                JPAExpressions.select(movie.screenwriter.height.max()).from(movie));

        Movie result = StreamSupport.stream(movieRepository.findAll(maxHeightPredicate).spliterator(), false)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Movie with the tallest screenwriter not found"));

        return movieMapper.movieToMovieResponse(result);
    }
}

package com.anvisero.movieservice.controller;

import com.anvisero.movieservice.dto.ColorsDto;
import com.anvisero.movieservice.dto.CountriesDto;
import com.anvisero.movieservice.dto.FilterRequest;
import com.anvisero.movieservice.dto.GenresDto;
import com.anvisero.movieservice.dto.LoosersResponseList;
import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.dto.MovieDtoResponse;
import com.anvisero.movieservice.dto.MoviesHonoredByLengthResponse;
import com.anvisero.movieservice.dto.RatingsDto;
import com.anvisero.movieservice.dto.SearchResponse;
import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.service.DirectorService;
import com.anvisero.movieservice.service.MovieService;
import com.anvisero.movieservice.util.validator.SearchRequestValidator;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    private final MovieService movieService;
    private final DirectorService directorService;

    public MovieController(MovieService movieService, DirectorService directorService) {
        this.movieService = movieService;
        this.directorService = directorService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDtoResponse> addMovie(@Validated @RequestBody MovieDto movieRequest) {
        MovieDtoResponse movieResponse = movieService.addMovie(movieRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(movieResponse);
    }

    @GetMapping(value = "/colors", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<ColorsDto> getColors() {
        ColorsDto colorsDto = new ColorsDto(movieService.getColors());
        return ResponseEntity.ok().body(colorsDto);
    }

    @GetMapping(value = "/countries", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<CountriesDto> getCountries() {
        CountriesDto countriesDto = new CountriesDto(movieService.getCountries());
        return ResponseEntity.ok().body(countriesDto);
    }

    @GetMapping(value = "/genres", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<GenresDto> getGenres() {
        GenresDto genresDto = new GenresDto(movieService.getGenres());
        return ResponseEntity.ok().body(genresDto);
    }

    @GetMapping(value = "/ratings", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<RatingsDto> getRatings() {
        RatingsDto genresDto = new RatingsDto(movieService.getRatings());
        return ResponseEntity.ok().body(genresDto);
    }

    @GetMapping(value = "/{id}", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDtoResponse> getMovieById(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE) Long id) {
        MovieDtoResponse movieResponse = movieService.getMovieById(id);
        return ResponseEntity.ok().body(movieResponse);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDtoResponse> updateMovie(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE) Long id,
            @Validated @RequestBody MovieDto movieRequest) {
        MovieDtoResponse movieResponse = movieService.updateMovie(id, movieRequest);
        return ResponseEntity.ok().body(movieResponse);
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<Void> deleteMovieById(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE) Long id) {
        movieService.deleteMovieById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/search", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<SearchResponse> search(@Validated @RequestBody(required = false) FilterRequest movieRequest) {
        log.debug("Search request: {}", movieRequest);
        SearchResponse searchResponse;
        if (movieRequest == null) {
            searchResponse =  movieService.searchDefault();
        } else {
            SearchRequestValidator.validateSearchRequest(movieRequest);
            searchResponse = movieService.search(movieRequest);
        }
        return ResponseEntity.ok().body(searchResponse);
    }

    @GetMapping(value = "/screenwriter/max", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDtoResponse> getScreenwriterMax() {
        MovieDtoResponse movieResponse = movieService.getScreenwriterMax();
        return ResponseEntity.ok().body(movieResponse);
    }

    @GetMapping(value = "/directors/get-loosers", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<LoosersResponseList> getLosers() {
        LoosersResponseList personResponse = directorService.getLosers();
        return ResponseEntity.ok().body(personResponse);
    }

    @PatchMapping(value = "/honor-by-length/{min-length}/oscars-to-add", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MoviesHonoredByLengthResponse> additionallyAward(
            @PathVariable("min-length")
            @Min(value = 0, message = "ID must be equal or greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE)
            Integer minLength) {
        MoviesHonoredByLengthResponse personResponse = movieService.additionallyAward(minLength);
        return ResponseEntity.ok().body(personResponse);
    }
}

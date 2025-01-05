package com.anvisero.movieservice.controller;

import com.anvisero.movieservice.dto.FilterRequest;
import com.anvisero.movieservice.dto.LoosersResponseList;
import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.dto.MoviesHonoredByLengthResponse;
import com.anvisero.movieservice.dto.SearchResponse;
import com.anvisero.movieservice.service.DirectorService;
import com.anvisero.movieservice.service.MovieService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    public ResponseEntity<MovieDto> addMovie(@Validated @RequestBody MovieDto movieRequest) {
        MovieDto movieResponse = movieService.addMovie(movieRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(movieResponse);
    }

    @GetMapping(value = "/{id}", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDto> getMovieById(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE) Long id) {
        MovieDto movieResponse = movieService.getMovieById(id);
        return ResponseEntity.ok().body(movieResponse);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDto> updateMovie(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE) Long id,
            @Validated @RequestBody MovieDto movieRequest) {
        MovieDto movieResponse = movieService.updateMovie(id, movieRequest);
        return ResponseEntity.ok().body(movieResponse);
    }

    @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<Void> deleteMovieById(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE) Long id) {
        movieService.deleteMovieById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/search", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<SearchResponse> search(@Validated @RequestBody(required = false) FilterRequest movieRequest) {
        SearchResponse searchResponse;
        if (movieRequest == null) {
            searchResponse =  movieService.searchDefault();
        } else {
            FilterRequest movieRequestValidated = getValidatedRequest(movieRequest);
            searchResponse = movieService.search(movieRequestValidated);
        }
        return ResponseEntity.ok().body(searchResponse);
    }

    @GetMapping(value = "/screenwriter/max", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDto> getScreenwriterMax() {
        MovieDto movieResponse = movieService.getScreenwriterMax();
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
            @Min(value = 1, message = "ID must be greater than 0")
            @Max(value = Long.MAX_VALUE, message = "ID must be less than or equal to " + Long.MAX_VALUE)
            Integer minLength) {
        MoviesHonoredByLengthResponse personResponse = movieService.additionallyAward(minLength);
        return ResponseEntity.ok().body(personResponse);
    }

    private FilterRequest getValidatedRequest(@Validated FilterRequest  movieRequest) {
        return movieRequest;
    }
}

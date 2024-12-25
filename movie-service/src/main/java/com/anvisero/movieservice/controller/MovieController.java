package com.anvisero.movieservice.controller;

import com.anvisero.movieservice.dto.FilterRequest;
import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.dto.SearchResponse;
import com.anvisero.movieservice.service.MovieService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
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
    public ResponseEntity<MovieDto> getMovieById(
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
    public ResponseEntity<SearchResponse> search(@Validated @RequestBody FilterRequest movieRequest) {
        SearchResponse searchResponse = movieService.search(movieRequest);
        return ResponseEntity.ok().body(searchResponse);
    }

    @GetMapping(value = "/screenwriter/max", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MovieDto> getScreenwriterMax() {
        MovieDto movieResponse = movieService.getScreenwriterMax();
        return ResponseEntity.ok().body(movieResponse);
    }
}

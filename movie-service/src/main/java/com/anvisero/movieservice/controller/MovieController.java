package com.anvisero.movieservice.controller;

import com.anvisero.movieservice.dto.MovieDto;
import com.anvisero.movieservice.service.MovieService;
import com.anvisero.movieservice.validation.OnCreate;
import jakarta.validation.groups.Default;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseStatus(value = HttpStatus.CREATED)
    public ResponseEntity<MovieDto> addMovie(@Validated({OnCreate.class, Default.class}) @RequestBody MovieDto movieRequest) {
        MovieDto movieResponse = movieService.addMovie(movieRequest);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(movieResponse.getId())
                .toUri();
        return ResponseEntity.created(location).body(movieResponse);
    }

//    @PostMapping(consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
//    public ResponseEntity<MovieDto> addMovie(@Validated({OnCreate.class, Default.class}) @RequestBody MovieDto movieRequest) {
//        MovieDto movieResponse = movieService.addMovie(movieRequest);
//        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
//                .path("/{id}")
//                .buildAndExpand(movieResponse.getId())
//                .toUri();
//        return ResponseEntity.created(location).body(movieResponse);
//    }

}

package com.anvisero.oscar.controller;

import com.anvisero.oscar.dto.LoosersResponseList;
import com.anvisero.oscar.dto.MoviesHonoredByLengthResponse;
import com.anvisero.oscar.exception.NotFoundException;
import com.anvisero.oscar.service.DirectorService;
import com.anvisero.oscar.service.OscarService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/oscar")
public class OscarController {

    private final OscarService oscarService;
    private final DirectorService directorService;

    public OscarController(OscarService oscarService, DirectorService directorService) {
        this.oscarService = oscarService;
        this.directorService = directorService;
    }

    @GetMapping(value = "/directors/get-loosers", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<LoosersResponseList> getLosers() {
        LoosersResponseList losers = directorService.getLosers();
        return ResponseEntity.ok().body(losers);
    }

    @PatchMapping(value = "/movies/honor-by-length/{min-length}/oscars-to-add", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<MoviesHonoredByLengthResponse> additionallyAward(@PathVariable("min-length") Integer minLength) throws NotFoundException {
        MoviesHonoredByLengthResponse honoredMovies = oscarService.additionallyAward(minLength);
        return ResponseEntity.ok().body(honoredMovies);
    }
}

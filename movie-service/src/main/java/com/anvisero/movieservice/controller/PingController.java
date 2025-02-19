package com.anvisero.movieservice.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/movies")
public class PingController {

    @Value("${random.value}")
    private String value;

    @GetMapping("/ping")
    public String ping() {
        return "pong!" + value;
    }
}


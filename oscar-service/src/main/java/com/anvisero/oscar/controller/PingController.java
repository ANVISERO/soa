package com.anvisero.oscar.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping
    public String ping() {
        return "pong!";
    }
}

package com.anvisero.oscar.service;

import com.anvisero.oscar.dto.MoviesHonoredByLengthResponse;
import com.anvisero.oscar.http.Client;
import org.springframework.stereotype.Service;

@Service
public class OscarService {

    private final Client client;

    public OscarService(Client client) {
        this.client = client;
    }

    public MoviesHonoredByLengthResponse additionallyAward(Integer minLength) {
        return client.additionallyAward(minLength);
    }
}


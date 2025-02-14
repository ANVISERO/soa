package com.anvisero.oscar.service;

import com.anvisero.oscar.dto.LoosersResponseList;
import com.anvisero.oscar.http.Client;
import org.springframework.stereotype.Service;

@Service
public class DirectorService {
    private final Client client;

    public DirectorService(Client client) {
        this.client = client;
    }

    public LoosersResponseList getLosers() {
        return client.getLosers();
    }
}

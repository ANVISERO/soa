package com.anvisero.oscar.http;

import com.anvisero.oscar.dto.LoosersResponseList;
import com.anvisero.oscar.dto.MoviesHonoredByLengthResponse;
import com.anvisero.oscar.exception.NotFoundException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class Client {

    static RestTemplate restTemplate;

    static {
        restTemplate = new RestTemplate();
        HttpComponentsClientHttpRequestFactory httpRequestFactory = new HttpComponentsClientHttpRequestFactory();
        restTemplate.setRequestFactory(httpRequestFactory);
    }

    private static final String BASE_URL = "http://localhost:8765/api/v1/movies/";

    public LoosersResponseList getLosers() {
        String url = BASE_URL + "directors/get-loosers";

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_XML));

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<LoosersResponseList> response = restTemplate.exchange(url, HttpMethod.GET, entity, LoosersResponseList.class);
        return response.getBody();
    }

    public MoviesHonoredByLengthResponse additionallyAward(Integer minLength) throws NotFoundException {
        String url = BASE_URL + "honor-by-length/" + minLength + "/oscars-to-add";

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_XML));
        headers.setContentType(MediaType.APPLICATION_XML);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<MoviesHonoredByLengthResponse> response = restTemplate.exchange(
                url, HttpMethod.PATCH, entity, MoviesHonoredByLengthResponse.class);

        if (response.getBody() == null || response.getBody().getMovies() == null || response.getBody().getMovies().isEmpty()) {
            throw new NotFoundException("Not found");
        }

        return response.getBody();
    }
}

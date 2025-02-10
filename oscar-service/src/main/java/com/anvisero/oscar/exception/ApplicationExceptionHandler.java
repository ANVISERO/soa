package com.anvisero.oscar.exception;

import com.anvisero.oscar.exception.model.DefaultErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDateTime;

@Slf4j
@ControllerAdvice
public class ApplicationExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.NotFound.class)
    protected ResponseEntity<Object> handleHttpClientNotFound(HttpClientErrorException.NotFound ex) {
        DefaultErrorResponse response = DefaultErrorResponse.builder()
                .message("Not Found")
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {NotFoundException.class})
    protected ResponseEntity<Object> handleNotFoundException(NotFoundException ex) {
        DefaultErrorResponse response = DefaultErrorResponse.builder()
                .message("Not Found")
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {ResourceAccessException.class})
    protected ResponseEntity<Object> handleResourceAccessException(ResourceAccessException ex) {
        DefaultErrorResponse response = DefaultErrorResponse.builder()
                .message("External Service Unavailable")
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(value = {RuntimeException.class})
    protected ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        DefaultErrorResponse response = DefaultErrorResponse.builder()
                .message("Internal Server Error")
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

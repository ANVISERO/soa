package com.anvisero.movieservice.exception.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@JacksonXmlRootElement(localName = "Error")
public class DefaultErrorResponse {
    @JacksonXmlProperty(localName = "message")
    private String message;

    @JacksonXmlProperty(localName = "time")
    private LocalDateTime time;
}

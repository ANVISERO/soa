package com.anvisero.movieservice.exception.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "Error")
public class ValidationErrorResponse {
    @JacksonXmlProperty(localName = "message")
    private String message;

    @JacksonXmlElementWrapper(localName = "invalidFields")
    @JacksonXmlProperty(localName = "invalidField")
    private List<InvalidField> invalidFields;

    @JacksonXmlProperty(localName = "time")
    private LocalDateTime time;
}

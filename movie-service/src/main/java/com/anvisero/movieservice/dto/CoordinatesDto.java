package com.anvisero.movieservice.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JacksonXmlRootElement(localName = "Coordinate")
public class CoordinatesDto {
    @NotNull(message = "Укажите координату x")
    @JacksonXmlProperty(localName = "x")
    private double x;

    @NotNull(message = "Укажите координату y")
    @JacksonXmlProperty(localName = "y")
    private int y;
}

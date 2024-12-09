package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.CoordinateXDeserializer;
import com.anvisero.movieservice.deserializer.CoordinateYDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
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
    @NotNull(message = "Specify the x coordinate")
    @JsonDeserialize(using = CoordinateXDeserializer.class)
    @JacksonXmlProperty(localName = "x")
    private Double x;

    @NotNull(message = "Specify the y coordinate")
    @JsonDeserialize(using = CoordinateYDeserializer.class)
    @JacksonXmlProperty(localName = "y")
    private Integer y;
}

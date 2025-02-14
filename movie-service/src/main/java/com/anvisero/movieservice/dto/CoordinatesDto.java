package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.IntegerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "Coordinate")
public class CoordinatesDto {
    @NotNull(message = "Specify the x coordinate")
//    @JsonDeserialize(using = DoubleDeserializer.class)
    @JacksonXmlProperty(localName = "x")
    private BigDecimal x;

    @NotNull(message = "Specify the y coordinate")
    @JsonDeserialize(using = IntegerDeserializer.class)
    @JacksonXmlProperty(localName = "y")
    private Integer y;
}

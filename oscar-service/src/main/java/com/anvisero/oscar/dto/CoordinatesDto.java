package com.anvisero.oscar.dto;

import com.anvisero.oscar.deserializer.DoubleDeserializer;
import com.anvisero.oscar.deserializer.IntegerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "Coordinate")
public class CoordinatesDto {
    @NotNull(message = "Specify the x coordinate")
    @JsonDeserialize(using = DoubleDeserializer.class)
    @JacksonXmlProperty(localName = "x")
    private Double x;

    @NotNull(message = "Specify the y coordinate")
    @JsonDeserialize(using = IntegerDeserializer.class)
    @JacksonXmlProperty(localName = "y")
    private Integer y;
}

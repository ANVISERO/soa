package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.model.enums.Country;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

@JacksonXmlRootElement(localName = "Person")
public class PersonDto {
    @JacksonXmlProperty(localName = "name")
    private String name;

    @JacksonXmlProperty(localName = "birthday")
    private LocalDate birthday;

    @JacksonXmlProperty(localName = "height")
    private float height;

    @JacksonXmlProperty(localName = "hairColor")
    private Color hairColor;

    @JacksonXmlProperty(localName = "nationality")
    private Country nationality;
}

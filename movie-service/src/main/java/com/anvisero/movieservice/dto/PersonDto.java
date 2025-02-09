package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.ColorEnumLengthRestrictedDeserializer;
import com.anvisero.movieservice.deserializer.CountryEnumLengthRestrictedDeserializer;
import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.model.enums.Country;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "Person")
public class PersonDto {
    @NotBlank(message = "Person's name can not be empty")
    @Size(max = 255, message = "Person's name cannot be longer than 255 characters")
    @JacksonXmlProperty(localName = "name")
    private String name;

    @PastOrPresent(message = "Person's birthday must not be in future")
    @JacksonXmlProperty(localName = "birthday")
    private LocalDate birthday;

    @NotNull(message = "Please provide person's height")
    @Positive(message = "Person's height must be greater than zero")
    @JacksonXmlProperty(localName = "height")
    private Float height;

    @JsonDeserialize(using = ColorEnumLengthRestrictedDeserializer.class)
    @JacksonXmlProperty(localName = "hairColor")
    private Color hairColor;

    @JsonDeserialize(using = CountryEnumLengthRestrictedDeserializer.class)
    @JacksonXmlProperty(localName = "nationality")
    private Country nationality;
}

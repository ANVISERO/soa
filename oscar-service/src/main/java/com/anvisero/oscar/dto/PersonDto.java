package com.anvisero.oscar.dto;

import com.anvisero.oscar.deserializer.ColorEnumLengthRestrictedDeserializer;
import com.anvisero.oscar.deserializer.CountryEnumLengthRestrictedDeserializer;
import com.anvisero.oscar.dto.enums.Color;
import com.anvisero.oscar.dto.enums.Country;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

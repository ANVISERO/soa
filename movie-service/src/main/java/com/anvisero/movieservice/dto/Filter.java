package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.FieldTypeDeserializer;
import com.anvisero.movieservice.deserializer.FilterTypeDeserializer;
import com.anvisero.movieservice.dto.enums.FieldType;
import com.anvisero.movieservice.dto.enums.FilterType;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "filter")
public class Filter {

    @JsonDeserialize(using = FieldTypeDeserializer.class)
    @JacksonXmlProperty(localName = "field")
    FieldType field;

    @JsonDeserialize(using = FilterTypeDeserializer.class)
    @JacksonXmlProperty(localName = "filterType")
    FilterType filterType;

    @NotBlank(message = "Filter value can not be empty")
    @Size(max = 255, message = "Filter value length can not be more than 255 symbols")
    @JacksonXmlProperty(localName = "value")
    String value;
}

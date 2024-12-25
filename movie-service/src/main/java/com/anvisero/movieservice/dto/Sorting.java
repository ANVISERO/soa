package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.FieldTypeDeserializer;
import com.anvisero.movieservice.deserializer.SortingTypeDeserializer;
import com.anvisero.movieservice.dto.enums.FieldType;
import com.anvisero.movieservice.dto.enums.SortingType;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "sorting")
public class Sorting {

    @JsonDeserialize(using = FieldTypeDeserializer.class)
    @JacksonXmlProperty(localName = "field")
    FieldType field;

    @JsonDeserialize(using = SortingTypeDeserializer.class)
    @JacksonXmlProperty(localName = "type")
    SortingType type;
}

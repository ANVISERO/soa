package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.IntegerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "FilterRequest")
public class FilterRequest {

    @JsonDeserialize(using = IntegerDeserializer.class)
    @JacksonXmlProperty(localName = "page")
    Integer page;

    @JsonDeserialize(using = IntegerDeserializer.class)
    @JacksonXmlProperty(localName = "pageSize")
    Integer pageSize;

    @Valid
    @JacksonXmlElementWrapper(localName = "sortings")
    @JacksonXmlProperty(localName = "sorting")
    List<Sorting> sortings;

    @Valid
    @JacksonXmlElementWrapper(localName = "filters")
    @JacksonXmlProperty(localName = "filter")
    List<Filter> filters;
}

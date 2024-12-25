package com.anvisero.movieservice.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "SearchResponse")
public class SearchResponse {
    @JacksonXmlElementWrapper(localName = "movies")
    @JacksonXmlProperty(localName = "movie")
    List<MovieDto> movies;

    @JacksonXmlProperty(localName = "totalPages")
    Integer totalPages;
}

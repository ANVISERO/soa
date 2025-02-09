package com.anvisero.oscar.dto;

import com.anvisero.oscar.deserializer.MovieGenreEnumLengthRestrictedDeserializer;
import com.anvisero.oscar.deserializer.MpaaRatingEnumLengthRestrictedDeserializer;
import com.anvisero.oscar.dto.enums.MovieGenre;
import com.anvisero.oscar.dto.enums.MpaaRating;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JacksonXmlRootElement(localName = "MovieResponse")
public class MovieDto {

    @Null(message = "Unique identifier is set automatically")
    @JacksonXmlProperty(localName = "id")
    private Long id;

    @NotBlank(message = "Movie name cannot be empty")
    @Size(max = 255, message = "Movie name cannot be longer than 255 characters")
    @JacksonXmlProperty(localName = "name")
    private String name;

    @Valid
    @NotNull(message = "Coordinates cannot be empty")
    @JacksonXmlProperty(localName = "coordinates")
    private CoordinatesDto coordinates;

    @NotNull(message = "Number of Oscars cannot be empty")
    @PositiveOrZero(message = "Number of Oscars must be positive or zero")
    @Max(value = 100, message = "Number of Oscars cannot be more than 100")
    @JacksonXmlProperty(localName = "oscarsCount")
    private Long oscarsCount;

    @NotNull(message = "Please specify the movie genre")
    @JsonDeserialize(using = MovieGenreEnumLengthRestrictedDeserializer.class)
    @JacksonXmlProperty(localName = "genre")
    private MovieGenre genre;

    @NotNull(message = "Please specify the movie rating")
    @JsonDeserialize(using = MpaaRatingEnumLengthRestrictedDeserializer.class)
    @JacksonXmlProperty(localName = "mpaaRating")
    private MpaaRating mpaaRating;

    @Valid
    @JacksonXmlProperty(localName = "screenwriter")
    private PersonDto screenwriter;

    @Positive(message = "Movie duration must be greater than zero")
    @Max(value = 500, message = "Movie duration cannot exceed 500 minutes")
    @JacksonXmlProperty(localName = "duration")
    private Integer duration;
}

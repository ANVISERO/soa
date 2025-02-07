package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.MovieGenreEnumLengthRestrictedDeserializer;
import com.anvisero.movieservice.deserializer.MpaaRatingEnumLengthRestrictedDeserializer;
import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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

    @NotNull(message = "Please specify the movie duration")
    @Positive(message = "Movie duration must be greater than zero")
    @Max(value = 500, message = "Movie duration cannot exceed 500 minutes")
    @JacksonXmlProperty(localName = "duration")
    private Integer duration;
}

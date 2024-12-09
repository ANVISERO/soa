package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.deserializer.MovieGenreEnumLengthRestrictedDeserializer;
import com.anvisero.movieservice.deserializer.MpaaRatingEnumLengthRestrictedDeserializer;
import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import com.anvisero.movieservice.validation.OnCreate;
import com.anvisero.movieservice.validation.OnUpdate;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JacksonXmlRootElement(localName = "MovieResponse")
public class MovieDto {

    @Null(groups = OnCreate.class, message = "Unique identifier is set automatically")
    @NotNull(groups = OnUpdate.class, message = "Please provide the unique movie identifier")
    @Min(groups = OnUpdate.class, value = 1, message = "Unique identifier must be at least 1")
    @Max(groups = OnUpdate.class, value = Long.MAX_VALUE, message = "Unique identifier cannot be more than 9,223,372,036,854,775,807")
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
    @Positive(message = "Number of Oscars must be greater than zero")
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

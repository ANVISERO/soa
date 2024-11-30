package com.anvisero.movieservice.dto;

import com.anvisero.movieservice.model.Coordinates;
import com.anvisero.movieservice.model.Person;
import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import com.anvisero.movieservice.validation.OnCreate;
import com.anvisero.movieservice.validation.OnUpdate;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Positive;
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

    @Null(groups = OnCreate.class, message = "Уникальный идентификатор задаётся автоматически")
    @NotNull(groups = OnUpdate.class, message = "Укажите уникальный идентификатор фильма")
    @JacksonXmlProperty(localName = "id")
    private Long id;

    @NotBlank(message = "Название фильма не может быть пустым")
    @JacksonXmlProperty(localName = "name")
    private String name;

    @NotNull(message = "Координаты не могут быть пусты")
    @JacksonXmlProperty(localName = "coordinates")
    private CoordinatesDto coordinates;

    @Positive(message = "Количество оскаров должно быть больше нуля")
    @JacksonXmlProperty(localName = "oscarsCount")
    private long oscarsCount;

    @NotNull(message = "Укажите жанр фильма")
    @JacksonXmlProperty(localName = "genre")
    private MovieGenre genre;

    @NotNull(message = "Укажите рейтинг фильма")
    @JacksonXmlProperty(localName = "mpaaRating")
    private MpaaRating mpaaRating;

    @JacksonXmlProperty(localName = "screenwriter")
    private PersonDto screenwriter;

    @JacksonXmlProperty(localName = "duration")
    private Integer duration;
}

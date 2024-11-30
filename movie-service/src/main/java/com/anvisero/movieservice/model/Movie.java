package com.anvisero.movieservice.model;

import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Movie {
    private Long id;

    private String name;

    private Coordinates coordinates;

    private LocalDateTime creationDate;

    private long oscarsCount;

    private MovieGenre genre;

    private MpaaRating mpaaRating;

    private Person screenwriter;

    private Integer duration;
}

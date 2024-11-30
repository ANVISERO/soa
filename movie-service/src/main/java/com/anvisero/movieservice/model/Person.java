package com.anvisero.movieservice.model;

import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.model.enums.Country;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Person {
    private String name;

    private LocalDate birthday;

    private float height;

    private Color hairColor;

    private Country nationality;
}

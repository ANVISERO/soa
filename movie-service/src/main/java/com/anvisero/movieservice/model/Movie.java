package com.anvisero.movieservice.model;

import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "coordinate_id", referencedColumnName = "coordinate_id", nullable = false)
    private Coordinates coordinates;

    @Column(name = "creation_date", nullable = false, updatable = false, insertable = false)
    private LocalDateTime creationDate;

    @Column(name = "oscars_count")
    private long oscarsCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "genre")
    private MovieGenre genre;

    @Enumerated(EnumType.STRING)
    @Column(name = "mpaa_rating")
    private MpaaRating mpaaRating;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "screenwriter_id", referencedColumnName = "screenwriter_id")
    private Person screenwriter;

    @Column(name = "duration")
    private Integer duration;

//    public void setCreationDate(LocalDateTime dateTime) {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
//        this.creationDate = LocalDateTime.parse(dateTime.format(formatter));
//    }
}

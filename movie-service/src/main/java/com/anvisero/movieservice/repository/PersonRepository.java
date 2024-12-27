package com.anvisero.movieservice.repository;

import com.anvisero.movieservice.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PersonRepository extends JpaRepository<Person, Long> {

    @Query("SELECT DISTINCT p FROM Movie m " +
            "JOIN m.screenwriter p " +
            "WHERE m.oscarsCount = 0")
    List<Person> findDirectorsWithMoviesNoOscarWinning();
}

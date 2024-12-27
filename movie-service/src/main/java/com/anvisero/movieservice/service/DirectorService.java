package com.anvisero.movieservice.service;

import com.anvisero.movieservice.dto.LoosersResponseList;
import com.anvisero.movieservice.model.Person;
import com.anvisero.movieservice.repository.PersonRepository;
import com.anvisero.movieservice.util.PersonMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DirectorService {

    private final PersonRepository personRepository;

    public DirectorService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public LoosersResponseList getLosers() {
        List<Person> losers = personRepository.findDirectorsWithMoviesNoOscarWinning();
        return new LoosersResponseList(losers.stream().map(PersonMapper::personToPersonResponse).collect(Collectors.toList()));
    }
}

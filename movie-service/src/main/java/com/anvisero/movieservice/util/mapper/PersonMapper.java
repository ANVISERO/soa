package com.anvisero.movieservice.util.mapper;

import com.anvisero.movieservice.dto.PersonDto;
import com.anvisero.movieservice.model.Person;
import lombok.experimental.UtilityClass;

import java.math.BigDecimal;

@UtilityClass
public class PersonMapper {

    public Person personRequestToPerson(PersonDto personDto, Float height) {
        if (personDto == null) {
            return null;
        }

        Person.PersonBuilder person = Person.builder();

        person.name(personDto.getName());
        person.birthday(personDto.getBirthday());
        if (height != null) {
            person.height(height);
        }
        person.hairColor(personDto.getHairColor());
        person.nationality(personDto.getNationality());

        return person.build();
    }

    public PersonDto personToPersonResponse(Person person) {
        if (person == null) {
            return null;
        }

        PersonDto personDto = new PersonDto();

        personDto.setName(person.getName());
        personDto.setBirthday(person.getBirthday());
        personDto.setHeight(BigDecimal.valueOf(person.getHeight()));
        personDto.setHairColor(person.getHairColor());
        personDto.setNationality(person.getNationality());

        return personDto;
    }
}

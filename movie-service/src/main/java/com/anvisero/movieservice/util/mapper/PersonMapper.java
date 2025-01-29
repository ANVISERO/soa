package com.anvisero.movieservice.util.mapper;

import com.anvisero.movieservice.dto.PersonDto;
import com.anvisero.movieservice.model.Person;
import lombok.experimental.UtilityClass;

@UtilityClass
public class PersonMapper {

    public Person personRequestToPerson(PersonDto personDto) {
        if (personDto == null) {
            return null;
        }

        Person.PersonBuilder person = Person.builder();

        person.name(personDto.getName());
        person.birthday(personDto.getBirthday());
        if (personDto.getHeight() != null) {
            person.height(personDto.getHeight());
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
        personDto.setHeight(person.getHeight());
        personDto.setHairColor(person.getHairColor());
        personDto.setNationality(person.getNationality());

        return personDto;
    }
}

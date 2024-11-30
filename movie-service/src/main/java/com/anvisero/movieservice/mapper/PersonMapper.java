package com.anvisero.movieservice.mapper;

import com.anvisero.movieservice.dto.PersonDto;
import com.anvisero.movieservice.model.Person;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PersonMapper {
    Person personRequestToPerson(PersonDto personDto);

    PersonDto personToPersonResponse(Person person);
}

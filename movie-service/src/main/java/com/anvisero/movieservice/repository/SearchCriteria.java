package com.anvisero.movieservice.repository;

import com.anvisero.movieservice.dto.enums.FilterType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SearchCriteria {

    private String key;

    private FilterType operation;

    private Object value;
}

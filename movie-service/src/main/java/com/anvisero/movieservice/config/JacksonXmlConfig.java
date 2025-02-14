package com.anvisero.movieservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonXmlConfig {
    @Bean
    public Jackson2ObjectMapperBuilder xmlMapperBuilder() {
        return Jackson2ObjectMapperBuilder.xml();
    }
}

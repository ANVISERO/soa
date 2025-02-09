package com.anvisero.oscar.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;

import java.time.format.DateTimeFormatter;

@Configuration
public class WebConfig {

    @Bean
    public HttpMessageConverter<Object> xmlHttpMessageConverter() {
        // Создаём XmlMapper
        XmlMapper xmlMapper = new XmlMapper();

        // Регистрируем модуль для JavaTimeModule (поддержка LocalDateTime)
        JavaTimeModule javaTimeModule = new JavaTimeModule();

        // Устанавливаем кастомный формат для LocalDateTime
        javaTimeModule.addSerializer(
                java.time.LocalDateTime.class,
                new com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer(
                        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")
                )
        );

        xmlMapper.registerModule(javaTimeModule);

        // Отключаем вывод дат в виде timestamp
        xmlMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        // Отключаем исключение при наличии неизвестных полей
        xmlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Устанавливаем, чтобы пустые коллекции не сериализовались как null
        xmlMapper.configure(SerializationFeature.WRITE_EMPTY_JSON_ARRAYS, true);

        // Устанавливаем, чтобы null-значения не пропускались
        xmlMapper.setSerializationInclusion(com.fasterxml.jackson.annotation.JsonInclude.Include.ALWAYS);

        // Создаём и возвращаем HTTP Message Converter
        return new MappingJackson2XmlHttpMessageConverter(xmlMapper);
    }
}

package com.anvisero.movieservice.exception.handler;

import com.anvisero.movieservice.exception.model.InvalidField;
import com.anvisero.movieservice.exception.model.ValidationErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class ApplicationExceptionHandler {

//    @ExceptionHandler(HttpMessageNotReadableException.class)
//    public ResponseEntity<ValidationErrorResponse> handleValidationException(HttpMessageNotReadableException ex) {
//        InvalidField invalidField = new InvalidField(
//                ex.getLocalizedMessage(),
//                "Неизвестное поле: "
//        );
//
//        ValidationErrorResponse errorResponse = ValidationErrorResponse.builder()
//                .message("Ошибка обработки запроса.")
//                .invalidFields(Collections.singletonList(invalidField))
//                .time(LocalDateTime.now())
//                .build();
//
//        // Установка заголовков для XML
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_XML);
//
//        return new ResponseEntity<>(errorResponse, headers, HttpStatus.BAD_REQUEST);
//    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        // Извлечение списка неверных полей
        List<InvalidField> invalidFields = ex.getBindingResult().getFieldErrors().stream()
                .map(this::mapFieldError)
                .collect(Collectors.toList());

        // Создание объекта ValidationErrorResponse
        ValidationErrorResponse response = ValidationErrorResponse.builder()
                .message("Bad Request")
                .invalidFields(invalidFields)
                .time(LocalDateTime.now())
                .build();

        // Установка заголовков для XML
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        // Возврат ResponseEntity с объектом ответа
        return new ResponseEntity<>(response, headers, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    private InvalidField mapFieldError(FieldError fieldError) {
        return InvalidField.builder()
                .name(fieldError.getField())
                .reason(fieldError.getDefaultMessage())
                .build();
    }
}

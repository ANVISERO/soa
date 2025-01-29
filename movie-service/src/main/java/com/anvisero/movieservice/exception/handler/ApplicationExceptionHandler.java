package com.anvisero.movieservice.exception.handler;

import com.anvisero.movieservice.exception.FilterEnumValidationException;
import com.anvisero.movieservice.exception.NumericFieldParseException;
import com.anvisero.movieservice.exception.model.DefaultErrorResponse;
import com.anvisero.movieservice.exception.model.InvalidField;
import com.anvisero.movieservice.exception.model.ValidationErrorResponse;
import com.anvisero.movieservice.exception.parse.ParsingException;
import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.model.enums.Country;
import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import com.fasterxml.jackson.core.exc.StreamConstraintsException;
import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.persistence.EntityNotFoundException;
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
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class ApplicationExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ValidationErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        List<InvalidField> invalidFields = new ArrayList<>();

        System.out.println(ex.getMessage());
        System.out.println();
        Throwable cause = ex.getMostSpecificCause();
        if (cause instanceof JsonMappingException jsonEx) {
            String fullPath = extractFieldPath(jsonEx);
            String simplifiedReason = simplifyErrorMessage(jsonEx.getOriginalMessage());

            invalidFields.add(InvalidField.builder()
                    .name(fullPath)
                    .reason(simplifiedReason)
                    .build());
        } else if (cause instanceof DateTimeParseException) {
            String simplifiedReason = "Invalid date format. Expected format: yyyy-MM-dd.";

            String fieldPath = "unknown";
            if (ex.getCause() instanceof JsonMappingException jsonEx) {
                fieldPath = extractFieldPath(jsonEx);
            }

            invalidFields.add(InvalidField.builder()
                    .name(fieldPath)
                    .reason(simplifiedReason)
                    .build());
        } else if (cause instanceof DateTimeException) {
            String simplifiedReason = "Invalid date format. Expected format: yyyy-MM-dd.";

            String fieldPath = "unknown";
            if (ex.getCause() instanceof JsonMappingException jsonEx) {
                fieldPath = extractFieldPath(jsonEx);
            }

            invalidFields.add(InvalidField.builder()
                    .name(fieldPath)
                    .reason(cause.getMessage())
                    .build());
        } else if (cause instanceof StreamConstraintsException streamConstraintsException) {
            String simplifiedReason = "Number value length exceeds the maximum allowed. Check the value length.";

            String fieldPath = "unknown";
            if (ex.getCause() instanceof JsonMappingException jsonEx) {
                fieldPath = extractFieldPath(jsonEx);
            }

            invalidFields.add(InvalidField.builder()
                    .name(fieldPath)
                    .reason(simplifiedReason)
                    .build());
        } else if (cause instanceof NumericFieldParseException numericFieldParseException) {

            String fieldPath = "unknown";
            if (ex.getCause() instanceof JsonMappingException jsonEx) {
                fieldPath = extractFieldPath(jsonEx);
            }

            invalidFields.add(InvalidField.builder()
                    .name(fieldPath)
                    .reason(cause.getMessage())
                    .build());
        }

        if (invalidFields.isEmpty()) {
            invalidFields.add(InvalidField.builder()
                    .name("unknown")
                    .reason(cause.getMessage())
                    .build());
        }

        ValidationErrorResponse errorResponse = ValidationErrorResponse.builder()
                .message("Invalid input data")
                .invalidFields(invalidFields)
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(errorResponse, headers, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<InvalidField> invalidFields = ex.getBindingResult().getFieldErrors().stream()
                .map(this::mapFieldError)
                .collect(Collectors.toList());

        ValidationErrorResponse response = ValidationErrorResponse.builder()
                .message("Unprocessable Entity ")
                .invalidFields(invalidFields)
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        ValidationErrorResponse response = ValidationErrorResponse.builder().build();
        if (ex.getMessage().contains("Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long'")) {
            response.setInvalidFields(List.of(InvalidField.builder().name("id").reason("Invalid input for ID: must be a positive number less then 9,223,372,036,854,775,807").build()));
        } else if (ex.getMessage().contains("Failed to convert value of type 'java.lang.String' to required type 'java.lang.Integer'")) {
            response.setInvalidFields(List.of(InvalidField.builder().name("id").reason("Invalid input for ID: must be a positive number less then 2,147,483,647").build()));
        }
        response.setMessage("Bad Request");
        response.setTime(LocalDateTime.now());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<DefaultErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex) {
        DefaultErrorResponse response = DefaultErrorResponse.builder()
                .message("Not Found")
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ValidationErrorResponse> handleHandlerMethodValidationException(HandlerMethodValidationException ex) {
        ValidationErrorResponse response = ValidationErrorResponse.builder().message("Bad Request")
                .invalidFields(List.of(InvalidField.builder().name("id").reason("Invalid input for ID: must be a positive number less then 9,223,372,036,854,775,807").build()))
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FilterEnumValidationException.class)
    public ResponseEntity<ValidationErrorResponse> handleFilterEnumValidationException(FilterEnumValidationException ex) {
        ValidationErrorResponse response = ValidationErrorResponse.builder().message("Bad Request")
                .invalidFields(List.of(InvalidField.builder().name(ex.getFieldName()).reason(ex.getMessage()).build()))
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ParsingException.class)
    public ResponseEntity<ValidationErrorResponse> handleLongParsingException(ParsingException ex) {
        ValidationErrorResponse response = ValidationErrorResponse.builder().message("Bad Request")
                .invalidFields(List.of(InvalidField.builder().name(ex.getField()).reason(ex.getMessage()).build()))
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<DefaultErrorResponse> handleRuntimeException(RuntimeException ex) {
        System.out.println(ex.getMessage());
        System.out.println(ex.getClass());
        DefaultErrorResponse response = DefaultErrorResponse.builder()
                .message("Internal Server Error")
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private InvalidField mapFieldError(FieldError fieldError) {
        return InvalidField.builder()
                .name(fieldError.getField())
                .reason(fieldError.getDefaultMessage())
                .build();
    }

    private String extractFieldPath(JsonMappingException ex) {
        List<String> pathElements = ex.getPath().stream()
                .map(reference -> {
                    if (reference.getFieldName() != null) {
                        return reference.getFieldName();
                    } else if (reference.getIndex() != -1) {
                        return "[" + reference.getIndex() + "]";
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        for (int i = 1; i < pathElements.size(); i++) {
            if (pathElements.get(i).startsWith("[")) {
                pathElements.set(i - 1, pathElements.get(i - 1) + pathElements.get(i));
                pathElements.remove(i);
                i--;
            }
        }

        return String.join(".", pathElements);
    }


    private String simplifyErrorMessage(String originalMessage) {
        if (originalMessage.contains("Cannot deserialize value of type")) {
            if (originalMessage.contains("LocalDate")) {
                return "Invalid date format. Expected format: yyyy-MM-dd.";
            } else if (originalMessage.contains("Enum")) {
                String expectedValues = extractExpectedEnumValues(originalMessage);
                return "Invalid value. Expected one of: " + expectedValues;
            } else if (originalMessage.contains("String")) {
                return "Number expected, but String received";
            } else if (originalMessage.contains("Double") || originalMessage.contains("Float")) {
                return "Invalid number format. Use '.' as a decimal separator.";
            } else if (originalMessage.contains("Integer")) {
                return "Invalid number format. Integer value expected.";
            }
        } else if (originalMessage.contains("java.time.format.DateTimeParseException")) {
            return "Invalid date format. Expected format: yyyy-MM-dd.";
        } else if (originalMessage.contains("Value length exceeds maximum allowed limit")
                || originalMessage.contains("Please specify")
                || originalMessage.contains("Invalid format for coordinate")
                || originalMessage.contains("Invalid value for")) {
            return originalMessage;
        }
        return "Invalid value provided";
    }

    private String extractExpectedEnumValues(String message) {
        if (message.contains("MovieGenre")) {
            return Arrays.toString(MovieGenre.values());
        } else if (message.contains("MpaaRating")) {
            return Arrays.toString(MpaaRating.values());
        } else if (message.contains("Color")) {
            return Arrays.toString(Color.values());
        } else if (message.contains("Country")) {
            return Arrays.toString(Country.values());
        }
        return "unknown values";
    }
}

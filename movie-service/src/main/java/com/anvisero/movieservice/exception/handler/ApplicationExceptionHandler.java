package com.anvisero.movieservice.exception.handler;

import com.anvisero.movieservice.exception.NumericFieldParseException;
import com.anvisero.movieservice.exception.model.InvalidField;
import com.anvisero.movieservice.exception.model.ValidationErrorResponse;
import com.anvisero.movieservice.model.enums.Color;
import com.anvisero.movieservice.model.enums.Country;
import com.anvisero.movieservice.model.enums.MovieGenre;
import com.anvisero.movieservice.model.enums.MpaaRating;
import com.fasterxml.jackson.core.exc.StreamConstraintsException;
import com.fasterxml.jackson.databind.JsonMappingException;
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

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
            System.out.println(cause.getMessage());
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

    @ExceptionHandler(NumericFieldParseException.class)
    public ResponseEntity<ValidationErrorResponse> handleNumericFieldParseException(NumericFieldParseException ex) {
        List<InvalidField> invalidFields = List.of(InvalidField.builder().name("coordinates.x").reason(ex.getMessage()).build());

        System.out.println(invalidFields.toString());
        ValidationErrorResponse response = ValidationErrorResponse.builder()
                .message("Unprocessable Entity")
                .invalidFields(invalidFields)
                .time(LocalDateTime.now())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);

        return new ResponseEntity<>(response, headers, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    private InvalidField mapFieldError(FieldError fieldError) {
        return InvalidField.builder()
                .name(fieldError.getField())
                .reason(fieldError.getDefaultMessage())
                .build();
    }

    private String extractFieldPath(JsonMappingException ex) {
        return ex.getPath().stream()
                .map(JsonMappingException.Reference::getFieldName)
                .collect(Collectors.joining("."));
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
                || originalMessage.contains("Please specify") || originalMessage.contains("Invalid format for coordinate")) {
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

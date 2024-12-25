package com.anvisero.movieservice.dto.enums;

public enum FieldType {
    ID("id"),
    NAME("name"),
    COORDINATE_X("coordinate.x"),
    COORDINATE_Y("coordinate.y"),
    CREATION_DATE("creationDate"),
    OSCARS_COUNT("oscarsCount"),
    GENRE("genre"),
    MPAA_RATING("mpaaRating"),
    SCREENWRITER_NAME("screenwriter.name"),
    SCREENWRITER_BIRTHDAY("screenwriter.birthday"),
    SCREENWRITER_HEIGHT("screenwriter.height"),
    SCREENWRITER_HAIR_COLOR("screenwriter.hairColor"),
    SCREENWRITER_NATIONALITY("screenwriter.nationality"),
    DURATION("duration"),;

    private final String value;

    FieldType(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    public static FieldType fromValue(String text) {
        for (FieldType b : FieldType.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Unexpected value '" + text + "'");
    }
}

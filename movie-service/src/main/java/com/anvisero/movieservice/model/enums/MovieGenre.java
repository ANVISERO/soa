package com.anvisero.movieservice.model.enums;

public enum MovieGenre {
    ACTION("ACTION"),
    MUSICAL("MUSICAL"),
    ADVENTURE("ADVENTURE"),
    FANTASY("FANTASY");

    private final String value;

    MovieGenre(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    public static MovieGenre fromValue(String text) {
        for (MovieGenre b : MovieGenre.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }
}

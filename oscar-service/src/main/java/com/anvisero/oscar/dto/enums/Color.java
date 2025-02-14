package com.anvisero.oscar.dto.enums;

public enum Color {
    BLACK("BLACK"),
    YELLOW("YELLOW"),
    ORANGE("ORANGE"),
    WHITE("WHITE");

    private final String value;

    Color(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    public static Color fromValue(String text) {
        for (Color b : Color.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }
}

package com.anvisero.oscar.dto.enums;

public enum Country {
    UNITED_KINGDOM("UNITED_KINGDOM"),
    FRANCE("FRANCE"),
    SPAIN("SPAIN"),
    INDIA("INDIA");

    private final String value;

    Country(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    public static Country fromValue(String text) {
        for (Country b : Country.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }
}

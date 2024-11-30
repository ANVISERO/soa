package com.anvisero.movieservice.model.enums;

public enum MpaaRating {
    G("G"),
    PG("PG"),
    R("R"),
    NC_17("NC_17");

    private final String value;

    MpaaRating(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    public static MpaaRating fromValue(String text) {
        for (MpaaRating b : MpaaRating.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }
}

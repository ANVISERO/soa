package com.anvisero.oscar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OscarServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OscarServiceApplication.class, args);
    }

//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
//        return builder.sources(OscarServiceApplication.class);
//    }
}

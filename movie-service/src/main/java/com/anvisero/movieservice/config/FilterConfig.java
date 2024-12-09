package com.anvisero.movieservice.config;

import com.anvisero.movieservice.filter.RateLimitingFilter;
import com.anvisero.movieservice.filter.UrlLengthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<UrlLengthFilter> loggingUrlLengthFilter() {
        FilterRegistrationBean<UrlLengthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new UrlLengthFilter());
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean<RateLimitingFilter> loggingRateLimitingFilter() {
        FilterRegistrationBean<RateLimitingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RateLimitingFilter());
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }
}

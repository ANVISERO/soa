package com.anvisero.movieservice.filter;

import com.anvisero.movieservice.exception.UriTooLongException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@WebFilter(filterName = "urlLengthFilter", urlPatterns = "/*")
public class UrlLengthFilter implements Filter {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    private static final int MAX_URL_LENGTH = 1024;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestUri = httpRequest.getRequestURI() + (httpRequest.getQueryString() != null ? "?" + httpRequest.getQueryString() : "");

        if (requestUri.length() > MAX_URL_LENGTH) {
            httpResponse.setStatus(HttpServletResponse.SC_REQUEST_URI_TOO_LONG);
            httpResponse.setContentType("application/xml");
            httpResponse.getWriter().write(
                    String.format(
                            """
                            <Error>
                                <message>URI length exceeds the maximum allowed limit of %d characters.</message>
                                <time>%s</time>
                            </Error>
                            """,
                            MAX_URL_LENGTH,
                            LocalDateTime.now().format(formatter)
                    )
            );
            return;
        }

        chain.doFilter(request, response);
    }
}

package com.anvisero.oscar.filter;


import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
                    "<Error>\n\t<message>URI length exceeds the maximum allowed limit of "
                            + LocalDateTime.now().format(formatter)
                            + " characters.</message>\n\t<time>" + MAX_URL_LENGTH + "</time>\n</Error>"
            );
            return;
        }

        chain.doFilter(request, response);
    }
}

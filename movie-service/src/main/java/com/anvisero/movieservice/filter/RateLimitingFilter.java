package com.anvisero.movieservice.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    private static final long LIMIT_TIME_WINDOW = 60;

    private final Map<String, RequestData> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String ipAddress = request.getRemoteAddr();

        RequestData requestData = requestCounts.computeIfAbsent(ipAddress, ip -> new RequestData());

        if (requestData.isTimeWindowExpired()) {
            requestData.reset(LocalDateTime.now());
        }

        if (requestData.getRequestCount() >= MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/xml");
            response.getWriter().write("<Error><message>Too Many Requests</message><time>"
                    + LocalDateTime.now().format(formatter) + "</time></Error>");
        } else {
            requestData.incrementRequestCount();
            filterChain.doFilter(request, response);
        }
    }

    private static class RequestData {
        @Getter
        private int requestCount;
        private LocalDateTime firstRequestTime;

        public RequestData() {
            this.firstRequestTime = LocalDateTime.now();
            this.requestCount = 0;
        }

        public boolean isTimeWindowExpired() {
            return Duration.between(firstRequestTime, LocalDateTime.now()).getSeconds() > LIMIT_TIME_WINDOW;
        }

        public void reset(LocalDateTime newFirstRequestTime) {
            this.firstRequestTime = newFirstRequestTime;
            this.requestCount = 0;
        }

        public void incrementRequestCount() {
            this.requestCount++;
        }
    }
}

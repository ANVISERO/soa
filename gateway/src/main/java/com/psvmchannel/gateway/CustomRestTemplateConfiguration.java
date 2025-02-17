package com.psvmchannel.gateway;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.cloud.netflix.zuul.filters.ZuulProperties;
import org.springframework.cloud.netflix.zuul.filters.route.SimpleHostRoutingFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;

@Configuration
public class CustomRestTemplateConfiguration {

    @Value("${trust.store.url}")
    private Resource trustStore;

    @Value("${trust.store.password}")
    private String trustStorePassword;

    @Bean
    public RestTemplate restTemplate() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException, CertificateException, IOException {
        // Загружаем truststore и создаем SSLContext
        SSLContext sslContext = new SSLContextBuilder()
                .loadTrustMaterial(trustStore.getURL(), trustStorePassword.toCharArray())
                .build();

        // Создаем SSLConnectionSocketFactory с нашим SSLContext
        SSLConnectionSocketFactory sslConFactory = new SSLConnectionSocketFactory(sslContext);

        // Создаем HTTP-клиент с настроенным SSL
        CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(sslConFactory)
                .build();

        // Создаем фабрику запросов для RestTemplate
        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);

        // Возвращаем RestTemplate с настроенной фабрикой
        return new RestTemplate(requestFactory);
    }

    @Bean
    public SimpleHostRoutingFilter simpleHostRoutingFilter(ProxyRequestHelper proxyRequestHelper, ZuulProperties zuulProperties)
            throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException, IOException, CertificateException {
//        // Создаем SSLContext, который доверяет всем сертификатам
//        SSLContext sslContext = new SSLContextBuilder()
//                .loadTrustMaterial(new TrustAllStrategy())
//                .build();

        // Создаем SSLConnectionSocketFactory с нашим SSLContext
//        SSLConnectionSocketFactory sslConFactory = new SSLConnectionSocketFactory(sslContext);

        // Создаем HTTP-клиент с настроенным SSL
//        CloseableHttpClient httpClient = HttpClients.custom()
//                .setSSLSocketFactory(sslConFactory)
//                .build();

        SSLContext sslContext = new SSLContextBuilder()
                .loadTrustMaterial(trustStore.getURL(), trustStorePassword.toCharArray())
                .build();

        // Создаем SSLConnectionSocketFactory с нашим SSLContext
        SSLConnectionSocketFactory sslConFactory = new SSLConnectionSocketFactory(sslContext);

        // Создаем HTTP-клиент с настроенным SSL
        CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(sslConFactory)
                .build();

        // Создаем фабрику запросов для RestTemplate
//        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);

        // Возвращаем кастомный фильтр с настроенным HTTP-клиентом
        return new SimpleHostRoutingFilter(proxyRequestHelper, zuulProperties, httpClient);
    }
}

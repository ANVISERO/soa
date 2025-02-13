package com.anvisero.oscar.http;

import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;

public class SSLConfigurationProvider {
    private static final String TRUSTSTORE_FILENAME = "mytruststore.p12";
    private static final String TRUSTSTORE_PASSWORD = "changeit";

    public SSLContext getSSLContext()
            throws KeyStoreException, IOException, CertificateException, NoSuchAlgorithmException, KeyManagementException {
        KeyStore truststore = KeyStore.getInstance(KeyStore.getDefaultType());
        ClassLoader classLoader = getClass().getClassLoader();

        try (InputStream truststoreStream = classLoader.getResourceAsStream(TRUSTSTORE_FILENAME)) {
            truststore.load(truststoreStream, TRUSTSTORE_PASSWORD.toCharArray());
        }

        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(truststore);

        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, trustManagerFactory.getTrustManagers(), null);

        return sslContext;
    }

    public PoolingHttpClientConnectionManager getConnectionManager(SSLContext sslContext) {
        return PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(
                        SSLConnectionSocketFactoryBuilder
                                .create()
                                .setSslContext(sslContext)
                                .build())
                .build();
    }

    public CloseableHttpClient createHttpClient(PoolingHttpClientConnectionManager connectionManager) {
        return HttpClients.custom()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(RequestConfig.DEFAULT)
                .build();
    }
}

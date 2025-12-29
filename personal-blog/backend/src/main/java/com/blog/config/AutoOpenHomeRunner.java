package com.blog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.awt.Desktop;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class AutoOpenHomeRunner implements ApplicationRunner {
    @Value("${app.autoOpenHome:true}")
    private boolean autoOpenHome;
    @Value("${app.homeUrl:personal-blog/frontend/pages/index.html}")
    private String homeUrl;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!autoOpenHome) return;
        if (!Desktop.isDesktopSupported()) return;
        Desktop desktop = Desktop.getDesktop();
        URI uri;
        String lower = homeUrl.toLowerCase();
        if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("file:")) {
            uri = URI.create(homeUrl);
        } else {
            Path base = Paths.get(System.getProperty("user.dir"));
            Path target = base.resolve(homeUrl).toAbsolutePath();
            uri = target.toUri();
        }
        try {
            desktop.browse(uri);
        } catch (Exception e) {
        }
    }
}

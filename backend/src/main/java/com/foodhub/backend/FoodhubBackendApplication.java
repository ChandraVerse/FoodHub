package com.foodhub.backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodhubBackendApplication {

    public static void main(String[] args) {
        loadMongoUriFromEnvFile();
        SpringApplication.run(FoodhubBackendApplication.class, args);
    }

    private static void loadMongoUriFromEnvFile() {
        Path rootEnv = Path.of("..", ".env.local");
        Path localEnv = Path.of(".env.local");
        Path envPath = Files.exists(rootEnv) ? rootEnv : localEnv;
        if (!Files.exists(envPath)) {
            return;
        }
        try {
            List<String> lines = Files.readAllLines(envPath);
            for (String line : lines) {
                if (line == null) {
                    continue;
                }
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                    continue;
                }
                if (trimmed.startsWith("MONGODB_URI=")) {
                    String value = trimmed.substring("MONGODB_URI=".length()).trim();
                    if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
                        value = value.substring(1, value.length() - 1);
                    }
                    if (!value.isEmpty()) {
                        System.setProperty("MONGODB_URI", value);
                    }
                    break;
                }
            }
        } catch (IOException ignored) {
        }
    }
}

package com.cg4academy.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JitsiService {

    @Value("${jitsi.app.id:my-app-id}")
    private String appId;

    @Value("${jitsi.app.secret:my-very-secure-secret-key}")
    private String appSecret;

    @Value("${jitsi.app.kid:my-key-id}")
    private String appKeyId;

    public String generateToken(String roomName, String userName, String userEmail, String userId,
            boolean isModerator) {
        // Prepare context
        Map<String, Object> context = new HashMap<>();
        Map<String, Object> user = new HashMap<>();
        user.put("name", userName);
        user.put("email", userEmail);
        user.put("id", userId);
        user.put("avatar", ""); // Can add avatar URL if needed
        context.put("user", user);

        // JaaS requires the 'features' object to be present.
        // We set permissions based on isModerator, but the object itself usually must
        // exist.
        // For JaaS dev/testing, often setting them to true is the verification step,
        // but let's be careful. If 'missing' is the error, existence is key.
        // We will default to enabled for simplicity in this 'Study Together' context,
        // or we could map them to isModerator.
        // Let's explicitly set them.
        Map<String, Object> features = new HashMap<>();
        features.put("livestreaming", "true");
        features.put("recording", "true");
        features.put("transcription", "true");
        features.put("outbound-call", "true"); // Often required by JaaS
        context.put("features", features);

        try {
            String cleanKey = appSecret;
            if (cleanKey != null) {
                cleanKey = cleanKey
                        .replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "")
                        .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                        .replace("-----END RSA PRIVATE KEY-----", "")
                        .replace("\\n", "")
                        .replace("\n", "")
                        .replaceAll("\\s+", "");
            }

            byte[] keyBytes = java.util.Base64.getDecoder().decode(cleanKey);

            // Fix for "extra data at the end" (ASN.1 length correction)
            // This is critical if the key has trailing whitespace/chars when parsed
            if (keyBytes.length > 0 && keyBytes[0] == 0x30) {
                int length = 0;
                int headerLen = 0;

                if ((keyBytes[1] & 0x80) == 0) {
                    length = keyBytes[1];
                    headerLen = 2;
                } else {
                    int numBytes = keyBytes[1] & 0x7F;
                    headerLen = 2 + numBytes;
                    for (int i = 0; i < numBytes; i++) {
                        length = (length << 8) | (keyBytes[2 + i] & 0xFF);
                    }
                }

                int expectedLength = headerLen + length;
                if (keyBytes.length > expectedLength) {
                    byte[] trimmed = new byte[expectedLength];
                    System.arraycopy(keyBytes, 0, trimmed, 0, expectedLength);
                    keyBytes = trimmed;
                }
            }

            java.security.spec.PKCS8EncodedKeySpec spec = new java.security.spec.PKCS8EncodedKeySpec(keyBytes);
            java.security.KeyFactory kf = java.security.KeyFactory.getInstance("RSA");
            java.security.PrivateKey privateKey = kf.generatePrivate(spec);

            return Jwts.builder()
                    .setHeaderParam("kid", appKeyId)
                    .setAudience("jitsi")
                    .setIssuer("chat")
                    .setSubject(appId)
                    .claim("room", roomName)
                    .claim("context", context)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 3600 * 1000)) // 1 hour
                    .signWith(privateKey, SignatureAlgorithm.RS256)
                    .compact();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating Jitsi token: " + e.getMessage(), e);
        }
    }
}

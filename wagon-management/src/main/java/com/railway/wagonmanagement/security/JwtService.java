package com.railway.wagonmanagement.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    /*
     * JWT secret key.
     *
     * For development we keep this in application.properties.
     * Later this should be stored securely as an environment
     * variable or secret.
     */
    @Value("${jwt.secret}")
    private String jwtSecret;

    /*
     * Token validity in milliseconds.
     *
     * Example:
     * 3600000 = 1 hour
     */
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /*
     * Create the signing key from our configured secret.
     */
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }

    /*
     * Generate JWT for the authenticated user.
     */
    public String generateToken(
            String username,
            String role
    ) {

        Date now = new Date();

        Date expiration =
                new Date(
                        now.getTime() + jwtExpiration
                );

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    /*
     * Extract username from JWT.
     */
    public String extractUsername(
            String token
    ) {

        return extractAllClaims(token)
                .getSubject();
    }

    /*
     * Extract role from JWT.
     */
    public String extractRole(
            String token
    ) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    /*
     * Check whether token is valid for a username.
     */
    public boolean isTokenValid(
            String token,
            String username
    ) {

        try {

            String tokenUsername =
                    extractUsername(token);

            return tokenUsername.equals(username)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }

    /*
     * Check token expiration.
     */
    private boolean isTokenExpired(
            String token
    ) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    /*
     * Read all JWT claims.
     */
    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
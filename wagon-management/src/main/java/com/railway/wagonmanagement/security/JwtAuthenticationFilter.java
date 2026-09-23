package com.railway.wagonmanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService
    ) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        /*
         * No Authorization header
         */
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Extract JWT
         */
        String token =
                authorizationHeader.substring(7);

        try {

            /*
             * Extract username and role
             */
            String username =
                    jwtService.extractUsername(token);

            String role =
                    jwtService.extractRole(token);

            /*
             * Validate token
             */
            if (username != null
                    && jwtService.isTokenValid(
                            token,
                            username
                    )) {

                /*
                 * Create authenticated user
                 */
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                        );

                /*
                 * Store authentication
                 * in Spring Security context
                 */
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }

        } catch (Exception e) {

            /*
             * Invalid JWT.
             *
             * We do not authenticate the request.
             */
            SecurityContextHolder
                    .clearContext();
        }

        /*
         * Continue request
         */
        filterChain.doFilter(
                request,
                response
        );
    }
}
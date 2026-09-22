package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.entity.AppUser;
import com.railway.wagonmanagement.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser createUser(
            String username,
            String rawPassword,
            String email,
            String phone,
            String role
    ) {

        if (appUserRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(
                    "Username already exists"
            );
        }

        AppUser user = new AppUser();

        user.setUsername(username);

        user.setPasswordHash(
                passwordEncoder.encode(rawPassword)
        );

        user.setEmail(email);
        user.setPhone(phone);

        if (role != null && !role.isBlank()) {
            user.setRole(role);
        }

        user.setActive(true);

        return appUserRepository.save(user);
    }
}
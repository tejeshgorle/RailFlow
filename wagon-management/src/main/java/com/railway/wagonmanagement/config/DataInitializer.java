package com.railway.wagonmanagement.config;

import com.railway.wagonmanagement.entity.AppUser;
import com.railway.wagonmanagement.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (
            appUserRepository
                .findByUsername("operator")
                .isEmpty()
        ) {

            AppUser user = new AppUser();

            user.setUsername("operator");

            user.setPasswordHash(
                passwordEncoder.encode("RailFlow@123")
            );

            user.setEmail("operator@railflow.local");
            user.setPhone("9999999999");
            user.setRole("OPERATOR");
            user.setActive(true);

            appUserRepository.save(user);

            System.out.println(
                "========================================"
            );

            System.out.println(
                "RailFlow development user created"
            );

            System.out.println(
                "Username : operator"
            );

            System.out.println(
                "Password : RailFlow@123"
            );

            System.out.println(
                "========================================"
            );
        }
    }
}
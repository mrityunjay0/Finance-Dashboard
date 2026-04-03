package com.finance.dashboard.config;

import com.finance.dashboard.entity.User;
import com.finance.dashboard.enums.Role;
import com.finance.dashboard.enums.Status;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DBInitializer {

    @Bean
    public ApplicationRunner init(UserRepository repo, PasswordEncoder encoder) {

        return args -> {

            createIfNotExists(repo, encoder, "viewer", "viewer@finance.com", "viewer123", Role.VIEWER, Status.ACTIVE);
            createIfNotExists(repo, encoder, "analyst", "analyst@finance.com", "analyst123", Role.ANALYST, Status.ACTIVE);
            createIfNotExists(repo, encoder, "admin", "admin@finance.com", "admin123", Role.ADMIN, Status.ACTIVE);
        };
    }

    private void createIfNotExists(UserRepository repo,
                                   PasswordEncoder encoder,
                                   String name,
                                   String email,
                                   String password,
                                   Role role,
                                   Status status) {

        if (repo.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(encoder.encode(password));
            user.setRole(role);
            user.setStatus(status);

            repo.save(user);
        }
    }
}

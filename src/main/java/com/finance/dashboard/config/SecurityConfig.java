package com.finance.dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/login", "/css/**", "/js/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/analyst/**").hasRole("ANALYST")
                        .requestMatchers("/viewer/**").hasRole("VIEWER")

                        .requestMatchers("/dashboard/**")
                        .hasAnyRole("VIEWER", "ANALYST", "ADMIN")

                        .requestMatchers("/records/all", "/records/*", "/records/filter")
                        .hasAnyRole("ANALYST", "ADMIN")

                        .requestMatchers("/records/create",
                                "/records/update/**",
                                "/records/delete/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/user/**")
                        .hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .exceptionHandling(ex -> ex
                        .defaultAuthenticationEntryPointFor(
                                (request, response, authException) -> {
                                    response.sendError(401, "Unauthorized");
                                },
                                request -> request.getRequestURI().startsWith("/dashboard/")
                        )
                )

                .httpBasic(Customizer.withDefaults())

                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/", true)
                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
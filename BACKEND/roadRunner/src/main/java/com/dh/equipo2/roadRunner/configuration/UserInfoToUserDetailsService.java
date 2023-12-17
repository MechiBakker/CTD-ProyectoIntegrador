package com.dh.equipo2.roadRunner.configuration;

import com.dh.equipo2.roadRunner.domain.User;
import com.dh.equipo2.roadRunner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserInfoToUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.getByEmail(email);
        return optionalUser.map(UserEntityToUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("No se encontró un Usuario con email: " + email));
    }
}

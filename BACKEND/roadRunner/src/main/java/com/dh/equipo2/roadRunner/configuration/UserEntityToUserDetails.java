package com.dh.equipo2.roadRunner.configuration;

import com.dh.equipo2.roadRunner.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserEntityToUserDetails implements UserDetails {

    private String email;
    private String password;
    private List<GrantedAuthority> authorities;

    private List<String> roles = new ArrayList<>();

    private Boolean enabled;

    public UserEntityToUserDetails(User user) {
        email= user.getEmail();
        password= user.getPassword();
        roles.add(user.getRole().getName());
        authorities= roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        enabled = user.getEnabled();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

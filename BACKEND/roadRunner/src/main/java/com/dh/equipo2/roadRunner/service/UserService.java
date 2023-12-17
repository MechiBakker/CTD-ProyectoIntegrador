package com.dh.equipo2.roadRunner.service;

import com.dh.equipo2.roadRunner.domain.ConfirmationTokenEmail;
import com.dh.equipo2.roadRunner.domain.User;
import com.dh.equipo2.roadRunner.dto.UserDto;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.repository.ConfirmationTokenEmailRepository;
import com.dh.equipo2.roadRunner.repository.RoleRepository;
import com.dh.equipo2.roadRunner.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ConfirmationTokenEmailService confirmationTokenEmailService;

    @Autowired
    private ConfirmationTokenEmailRepository confirmationTokenEmailRepository;

    @Autowired
    private EmailService emailService;

    public Optional<String> createUser (UserDto userDto) throws DuplicateNameException {

        String message = null;
        String token = UUID.randomUUID().toString();
        String link = " http://localhost:5173/users/confirmation/" + token;

        if (userDto != null){

            Optional<User> optionalUser = userRepository.getByEmail(userDto.getEmail());
            if (optionalUser.isPresent()){
                if(optionalUser.get().getEnabled()==true){
                    log.error("El usuario con email " + userDto.getEmail() + " ya existe y está confirmado");
                    throw new DuplicateNameException("El usuario con email " + userDto.getEmail() + " ya existe y está confirmado");
                }
                emailService.send(userDto.getEmail(), buildEmail(userDto.getFirstName(),link));

                message = "Tu usuario ya había sido creado pero no confirmado. " +
                        "Enviamos nuevamente el correo de confirmación. " +
                        "Recuerda que tienes 1 hora para confirmar el correo";

                log.info("Tu usuario ya había sido creado pero no confirmado. " +
                        "Enviamos nuevamente el correo de confirmación. " +
                        "Recuerda que tienes 1 hora para confirmar el correo");

                return Optional.ofNullable(message);
            }

            User user = mapper.convertValue(userDto, User.class);
            user.setRole(roleRepository.getByName(userDto.getNameRole()).get());
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);

            ConfirmationTokenEmail confirmationTokenEmail = new ConfirmationTokenEmail(
                    token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(60), user
            );
            confirmationTokenEmailService.saveConfirmationTokenEmail(confirmationTokenEmail);

            emailService.send(userDto.getEmail(), buildEmail(userDto.getFirstName(),link));

            message = "Se ha enviado correo para validación de usuario: " + userDto.getEmail();
            log.info(message);
        }
        return Optional.ofNullable(message);
    }

    public List<UserDto> findAll(){

        List<UserDto> userDtoList = new ArrayList<>();
        List<User> userList = userRepository.findAll();

        for (User user:userList){
            UserDto userDto = mapper.convertValue(user, UserDto.class);
            userDto.setNameRole(user.getRole().getName());
            userDtoList.add(userDto);
            }
        return userDtoList;
    }

    public List<UserDto> getAllByRolName(String roleName) {

        List<UserDto> userDtoList = new ArrayList<>();
        List<User> userList = userRepository.getAllByRol(roleName);

        for (User user : userList) {
            UserDto userDto = mapper.convertValue(user, UserDto.class);
            userDto.setNameRole(user.getRole().getName());
            userDtoList.add(userDto);
        }
        return userDtoList;
    }

    public Optional<UserDto> getByEmail(String email) throws NotFoundNameException {

        UserDto userDto = null;

        Optional<User> optionalUser = userRepository.getByEmail(email);

        if (optionalUser.isEmpty()){
            log.error("Lo siento, pero no contamos con un usuario cuyo email sea: " + email);
            throw new NotFoundNameException("Lo siento, pero no contamos con un usuario cuyo email sea: " + email);
        }
        userDto = mapper.convertValue(optionalUser.get(),UserDto.class);
        userDto.setNameRole(optionalUser.get().getRole().getName());
        return Optional.ofNullable(userDto);
    }

    public Optional<String> deleteByEmail(String email) throws NotFoundNameException {

        Optional<UserDto> userDtoOptional = this.getByEmail(email);

        if (userDtoOptional.isPresent()){
            User user = userRepository.getByEmail(email).get();
            confirmationTokenEmailRepository.deleteByUser(user);
            userRepository.deleteByEmail(email);
            String message = "Se ha eliminado exitosamente al usuario con email: " + email;
            log.info(message);
        }
        return Optional.ofNullable("Se ha eliminado exitosamente al usuario con email: " + email);
    }

    public Optional<String> updateByEmail(String email, UserDto userDto) throws NotFoundNameException, DuplicateNameException {

        String message = null;
        this.deleteByEmail(email);
        this.createUser(userDto);
        message = "Actualización correcta del usuario con email: " + email;
        log.info(message);
        return Optional.ofNullable(message);
    }

    @Transactional
    public Optional<String> confirmToken(String token) throws NotFoundNameException, DuplicateNameException {
        String message = null;
        Optional<ConfirmationTokenEmail> optionalConfirmationTokenEmail = confirmationTokenEmailService.getConfirmationToken(token);
        if(optionalConfirmationTokenEmail.isEmpty()){
            throw new NotFoundNameException("Token no encontrado");
        }
        if(optionalConfirmationTokenEmail.get().getConfirmedAt()!=null){
            throw new DuplicateNameException("Este email ya había sido confirmado");
        }

        LocalDateTime expiredAt = optionalConfirmationTokenEmail.get().getExpiresAt();
        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("El token expiró, debes registrarte nuevamente");
        }
        confirmationTokenEmailService.setConfirmedAt(token);
        enableUser(optionalConfirmationTokenEmail.get().getUser().getEmail());
        User user = optionalConfirmationTokenEmail.get().getUser();
        emailService.send(user.getEmail(), confirmEmail(user.getFirstName()));
        message = "Se habilitó con exito al usuario";
        log.info(message);
        confirmationTokenEmailRepository.deleteByToken(token);
        return Optional.ofNullable(message);
    }

    public int enableUser(String email){
        return userRepository.enableUser(email);
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirma tu correo electrónico</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hola " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Gracias por registrarte. Por favor, haz clic en el enlace de abajo para activar tu cuenta: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activar ahora</a> </p></blockquote>\n El enlace expirará en 60 minutos. <p>Hasta pronto</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

    private String confirmEmail(String name) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirmación de cuenta</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">¡Hola " + name + ",</p>\n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Tu cuenta en Road Runner ha sido creada exitosamente</p>\n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Ya puedes ir al sitio web e iniciar sesion con tus datos.</p>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

}


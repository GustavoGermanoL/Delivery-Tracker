package com.DeliveryTracker.DeliveryTracker.security;



import com.DeliveryTracker.DeliveryTracker.entity.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Em produção, isso viria do application.properties, mas vou deixar fixo pra facilitar
    private String secret = "minha-palavra-secreta-super-dificil"; 

    public String generateToken(User user){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("delivery-earning-api")
                    .withSubject(user.getEmail()) // Salvamos o email no token
                    .withExpiresAt(genExpirationDate()) // Expira em 2 horas
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token", exception);
        }
    }

    public String validateToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("delivery-earning-api")
                    .build()
                    .verify(token)
                    .getSubject(); // Retorna o email se for válido
        } catch (JWTVerificationException exception){
            return ""; // Retorna vazio se for inválido
        }
    }

    private Instant genExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
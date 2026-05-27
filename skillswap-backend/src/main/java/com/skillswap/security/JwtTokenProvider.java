package com.skillswap.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expiration}") private long expiration;
    private Key key() { return Keys.hmacShaKeyFor(secret.getBytes()); }
    public String generateToken(String email) {
        return Jwts.builder().setSubject(email).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expiration))
                .signWith(key(),SignatureAlgorithm.HS256).compact();
    }
    public String getEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
    }
    public boolean validate(String token) {
        try { Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token); return true; }
        catch (JwtException|IllegalArgumentException e) { return false; }
    }
}

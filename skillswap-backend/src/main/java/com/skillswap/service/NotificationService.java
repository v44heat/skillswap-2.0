package com.skillswap.service;
import com.skillswap.dto.response.NotificationResponse;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.*;
import com.skillswap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notifRepo;
    private final UserRepository userRepo;
    public void send(Long userId, String title, String message, String type, Long relatedId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user==null) return;
        notifRepo.save(Notification.builder().user(user).title(title).message(message).type(type).relatedId(relatedId).build());
    }
    public List<NotificationResponse> getForUser(Long userId) {
        return notifRepo.findByUserIdOrderByCreatedAtDesc(userId).stream().map(NotificationResponse::from).collect(Collectors.toList());
    }
    @Transactional
    public NotificationResponse markRead(Long id, Long userId) {
        Notification n = notifRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Notification",id));
        if (!n.getUser().getId().equals(userId)) throw new ResourceNotFoundException("Notification",id);
        n.setIsRead(true);
        return NotificationResponse.from(notifRepo.save(n));
    }
    @Transactional
    public void markAllRead(Long userId) { notifRepo.markAllRead(userId); }
    @Transactional
    public void delete(Long id, Long userId) {
        Notification n = notifRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Notification",id));
        if (!n.getUser().getId().equals(userId)) throw new ResourceNotFoundException("Notification",id);
        notifRepo.delete(n);
    }
}

package com.skillswap.service;
import com.skillswap.dto.request.SkillRequest;
import com.skillswap.dto.response.SkillResponse;
import com.skillswap.exception.*;
import com.skillswap.model.*;
import com.skillswap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class SkillService {
    private final SkillRepository skillRepo;
    private final UserRepository userRepo;
    public List<SkillResponse> getMy(Long uid) {
        return skillRepo.findByUserId(uid).stream().map(SkillResponse::from).collect(Collectors.toList());
    }
    public List<SkillResponse> browse(Long uid, String search, String cat, String prof) {
        return skillRepo.browseSkills(uid, nvl(search), nvl(cat), nvl(prof)).stream().map(SkillResponse::from).collect(Collectors.toList());
    }
    @Transactional
    public SkillResponse create(Long uid, SkillRequest req) {
        User user = userRepo.findById(uid).orElseThrow(()->new ResourceNotFoundException("User",uid));
        Skill s = Skill.builder().user(user).skillName(req.getSkillName()).category(req.getCategory())
                .description(req.getDescription()).proficiency(req.getProficiency())
                .availability(req.getAvailability()).isActive(req.getIsActive()!=null?req.getIsActive():true).build();
        return SkillResponse.from(skillRepo.save(s));
    }
    @Transactional
    public SkillResponse update(Long id, Long uid, SkillRequest req) {
        Skill s = owned(id,uid);
        s.setSkillName(req.getSkillName()); s.setCategory(req.getCategory());
        s.setDescription(req.getDescription()); s.setProficiency(req.getProficiency());
        s.setAvailability(req.getAvailability());
        if (req.getIsActive()!=null) s.setIsActive(req.getIsActive());
        return SkillResponse.from(skillRepo.save(s));
    }
    @Transactional
    public void delete(Long id, Long uid) { skillRepo.delete(owned(id,uid)); }
    public List<SkillResponse> adminGetAll(String search, String cat) {
        return skillRepo.adminSearch(nvl(search),nvl(cat)).stream().map(SkillResponse::from).collect(Collectors.toList());
    }
    @Transactional
    public void adminDelete(Long id) { skillRepo.delete(skillRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Skill",id))); }
    @Transactional
    public SkillResponse adminToggle(Long id) {
        Skill s = skillRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Skill",id));
        s.setIsActive(!s.getIsActive()); return SkillResponse.from(skillRepo.save(s));
    }
    private Skill owned(Long id, Long uid) {
        Skill s = skillRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Skill",id));
        if (!s.getUser().getId().equals(uid)) throw new BadRequestException("You do not own this skill.");
        return s;
    }
    private String nvl(String s) { return s==null?"":s; }
}

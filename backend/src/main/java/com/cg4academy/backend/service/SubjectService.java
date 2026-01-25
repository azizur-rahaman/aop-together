package com.cg4academy.backend.service;

import com.cg4academy.backend.model.Subject;
import com.cg4academy.backend.repository.SubjectRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @PostConstruct
    public void init() {
        // Seed default subjects if empty
        if (subjectRepository.count() == 0) {
            seedSubjects();
        }
    }

    private void seedSubjects() {
        List<Subject> defaults = List.of(
                new Subject("Mathematics", "Calculator"),
                new Subject("Physics", "Atom"),
                new Subject("Chemistry", "FlaskConical"),
                new Subject("Biology", "Dna"),
                new Subject("Computer Science", "Laptop"),
                new Subject("Literature", "Book"),
                new Subject("History", "Landmark"),
                new Subject("Geography", "Globe"),
                new Subject("Art", "Palette"),
                new Subject("Music", "Music"));
        subjectRepository.saveAll(defaults);
        System.out.println("Seeded default subjects.");
    }
}

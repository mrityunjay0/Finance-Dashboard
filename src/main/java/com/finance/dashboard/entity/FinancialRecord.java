package com.finance.dashboard.entity;

import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "financial_records")
public class FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    private RecordType type;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User createdBy;
}

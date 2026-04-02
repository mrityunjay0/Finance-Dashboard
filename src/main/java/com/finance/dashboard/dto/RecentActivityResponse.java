package com.finance.dashboard.dto;

import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;

import java.time.LocalDate;

public class RecentActivityResponse {

    private Double amount;
    private RecordType type;
    private Category category;
    private LocalDate date;
    private String note;

    public RecentActivityResponse() {
    }

    public RecentActivityResponse(Double amount, RecordType type, Category category, LocalDate date, String note) {
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.date = date;
        this.note = note;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public RecordType getType() {
        return type;
    }

    public void setType(RecordType type) {
        this.type = type;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

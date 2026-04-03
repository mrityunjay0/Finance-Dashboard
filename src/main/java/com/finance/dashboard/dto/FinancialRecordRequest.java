package com.finance.dashboard.dto;

import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class FinancialRecordRequest {

    @NotNull(message = "Amount is required.")
    @Positive(message = "Amount must be positive.")
    private Double amount;

    @NotNull(message = "Record type is required.")
    private RecordType type;

    @NotNull(message = "Category is required.")
    private Category category;

    @Size(max = 500, message = "Description cannot exceed 500 characters.")
    private String description;

    @NotNull(message = "Date is required.")
    private LocalDate date;


    public FinancialRecordRequest() {
    }

    public FinancialRecordRequest(Double amount, RecordType type, Category category, String description, LocalDate date) {
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.description = description;
        this.date = date;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}

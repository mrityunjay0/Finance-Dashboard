package com.finance.dashboard.dto;

import com.finance.dashboard.enums.Category;

public class CategoryResponse {
    private Category category;
    private Double totalIncome;
    private Double totalExpense;

    public CategoryResponse() {
    }

    public CategoryResponse(Category category, Double totalIncome, Double totalExpense) {
        this.category = category;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }
}

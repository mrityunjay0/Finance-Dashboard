package com.finance.dashboard.dto;

public class MonthlyTrendResponse {

    private Integer month;
    private Double totalIncome;
    private Double totalExpense;

    public MonthlyTrendResponse() {
    }

    public MonthlyTrendResponse(Integer month, Double totalIncome, Double totalExpense) {
        this.month = month;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
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
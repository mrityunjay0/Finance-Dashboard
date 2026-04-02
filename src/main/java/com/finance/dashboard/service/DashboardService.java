package com.finance.dashboard.service;

import com.finance.dashboard.dto.CategoryResponse;
import com.finance.dashboard.dto.MonthlyTrendResponse;
import com.finance.dashboard.dto.SummaryResponse;

import java.util.List;

public interface DashboardService {

    public SummaryResponse getSummary();
    public List<CategoryResponse> getCategoryTotal();
    public List<MonthlyTrendResponse> getMonthlyTrends();
    public List<?> getRecentActivity();

}

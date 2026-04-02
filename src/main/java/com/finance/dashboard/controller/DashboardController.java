package com.finance.dashboard.controller;

import com.finance.dashboard.dto.CategoryResponse;
import com.finance.dashboard.dto.MonthlyTrendResponse;
import com.finance.dashboard.dto.RecentActivityResponse;
import com.finance.dashboard.dto.SummaryResponse;
import com.finance.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public SummaryResponse getSummary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/category-total")
    public List<CategoryResponse> getCategoryTotal() {
        return dashboardService.getCategoryTotal();
    }

    @GetMapping("/monthly-trends")
    public List<MonthlyTrendResponse> getMonthlyTrends() {
        return dashboardService.getMonthlyTrends();
    }

    @GetMapping("/recent-activity")
    public List<?> getRecentActivity() {
        return dashboardService.getRecentActivity();
    }
}

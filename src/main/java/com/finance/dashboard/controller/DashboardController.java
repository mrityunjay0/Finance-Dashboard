package com.finance.dashboard.controller;

import com.finance.dashboard.dto.CategoryResponse;
import com.finance.dashboard.dto.MonthlyTrendResponse;
import com.finance.dashboard.dto.RecentActivityResponse;
import com.finance.dashboard.dto.SummaryResponse;
import com.finance.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/category-total")
    public ResponseEntity<List<CategoryResponse>> getCategoryTotal() {
        return ResponseEntity.ok(dashboardService.getCategoryTotal());
    }

    @GetMapping("/monthly-trends")
    public ResponseEntity<List<MonthlyTrendResponse>> getMonthlyTrends() {
        return ResponseEntity.ok(dashboardService.getMonthlyTrends());
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<RecentActivityResponse>> getRecentActivity() {
        return ResponseEntity.ok(dashboardService.getRecentActivity());
    }
}

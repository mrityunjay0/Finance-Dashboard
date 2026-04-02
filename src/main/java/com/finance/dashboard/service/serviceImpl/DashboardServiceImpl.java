package com.finance.dashboard.service.serviceImpl;

import com.finance.dashboard.dto.CategoryResponse;
import com.finance.dashboard.dto.MonthlyTrendResponse;
import com.finance.dashboard.dto.RecentActivityResponse;
import com.finance.dashboard.dto.SummaryResponse;
import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import com.finance.dashboard.repository.FinancialRecordRepository;
import com.finance.dashboard.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final FinancialRecordRepository financialRecordRepository;

    public DashboardServiceImpl(FinancialRecordRepository financialRecordRepository) {
        this.financialRecordRepository = financialRecordRepository;
    }


    @Override
    public SummaryResponse getSummary() {
        // Implement logic to calculate total income, total expenses, and net balance
        Double totalIncome = financialRecordRepository.getTotalIncome();
        Double totalExpenses = financialRecordRepository.getTotalExpense();
        Double netBalance = totalIncome - totalExpenses;

        return new SummaryResponse(totalIncome, totalExpenses, netBalance);
    }

    @Override
    public List<CategoryResponse> getCategoryTotal() {

        List<Object[]> data = financialRecordRepository.getCategoryTotalsByType();

        Map<Category, CategoryResponse> map = new HashMap<>();

        for (Object[] row : data) {

            Category category = (Category) row[0];
            RecordType type = (RecordType) row[1];
            Double amount = (Double) row[2];

            CategoryResponse response = map.computeIfAbsent(
                    category,
                    c -> new CategoryResponse(c, 0.0, 0.0)
            );

            if (type == RecordType.INCOME) {
                response.setTotalIncome(response.getTotalIncome() + amount);
            } else {
                response.setTotalExpense(response.getTotalExpense() + amount);
            }
        }

        return new ArrayList<>(map.values());
    }

    @Override
    public List<MonthlyTrendResponse> getMonthlyTrends() {

        List<Object[]> data = financialRecordRepository.getMonthlyTotals();

        Map<Integer, MonthlyTrendResponse> map = new HashMap<>();

        for (Object[] row : data) {

            Integer month = (Integer) row[0];
            RecordType type = (RecordType) row[1];
            Double amount = (Double) row[2];

            MonthlyTrendResponse response = map.computeIfAbsent(
                    month,
                    m -> new MonthlyTrendResponse(m, 0.0, 0.0)
            );

            if (type == RecordType.INCOME) {
                response.setTotalIncome(response.getTotalIncome() + amount);
            } else {
                response.setTotalExpense(response.getTotalExpense() + amount);
            }
        }

        List<MonthlyTrendResponse> result = new ArrayList<>(map.values());

        // ✅ Sort by month (important)
        result.sort(Comparator.comparing(MonthlyTrendResponse::getMonth));

        return result;
    }

    @Override
    public List<RecentActivityResponse> getRecentActivity() {

        List<FinancialRecord> records =
                financialRecordRepository.findTop5ByOrderByDateDesc();

        List<RecentActivityResponse> result = new ArrayList<>();

        for (FinancialRecord r : records) {
            result.add(new RecentActivityResponse(
                    r.getAmount(),
                    r.getType(),
                    r.getCategory(),
                    r.getDate(),
                    r.getDescription()
            ));
        }

        return result;
    }
}

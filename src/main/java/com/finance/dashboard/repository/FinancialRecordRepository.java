package com.finance.dashboard.repository;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {

    List<FinancialRecord> findByType(RecordType type);
    List<FinancialRecord> findByCagtegory(Category category);
    List<FinancialRecord> findByDateRange(LocalDate start, LocalDate end);

    List<FinancialRecord> findByTypeCategoryDate(
            RecordType type,
            Category category,
            LocalDate start,
            LocalDate end
    );

    @Query("SELECT SUM(r.amount) FROM FinancialRecord r WHERE r.type = 'INCOME'")
    Double getTotalIncome();

    @Query("SELECT SUM(r.amount) FROM FinancialRecord r WHERE r.type = 'EXPENSE'")
    Double getTotalExpense();

//    @Query("SELECT r.category, SUM(r.amount) FROM FinancialRecord r GROUP BY r.category")
//    List<Object[]> getCategoryTotals();

    @Query("SELECT r FROM FinancialRecord r ORDER BY r.date DESC")
    List<FinancialRecord> findTop5ByOrderByDateDesc();

    @Query("SELECT MONTH(r.date), SUM(r.amount) FROM FinancialRecord r GROUP BY MONTH(r.date)")
    List<Object[]> getMonthlyTrends();

    @Query("SELECT r.category, r.type, SUM(r.amount) " +
            "FROM FinancialRecord r " +
            "GROUP BY r.category, r.type")
    List<Object[]> getCategoryTotalsByType();

    @Query("SELECT MONTH(r.date), r.type, SUM(r.amount) " +
            "FROM FinancialRecord r " +
            "GROUP BY MONTH(r.date), r.type")
    List<Object[]> getMonthlyTrendsByType();

    @Query("SELECT MONTH(r.date), r.type, SUM(r.amount) " +
            "FROM FinancialRecord r " +
            "GROUP BY MONTH(r.date), r.type")
    List<Object[]> getMonthlyTotals();
}

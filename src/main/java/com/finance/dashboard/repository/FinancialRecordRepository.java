package com.finance.dashboard.repository;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;

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
}

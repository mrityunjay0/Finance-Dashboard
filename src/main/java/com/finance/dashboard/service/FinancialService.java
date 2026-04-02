package com.finance.dashboard.service;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;

import java.time.LocalDate;
import java.util.List;

public interface FinancialService {

    public FinancialRecord createRecord(FinancialRecord record);
    public List<FinancialRecord> getAllRecords();
    public FinancialRecord getRecordById(Long id);
    public FinancialRecord updateRecord(Long id, FinancialRecord updatedRecord);
    public List<FinancialRecord> filterRecords(
            RecordType type,
            Category category,
            LocalDate startDate,
            LocalDate endDate
    );
    public void deleteRecord(Long id);
}

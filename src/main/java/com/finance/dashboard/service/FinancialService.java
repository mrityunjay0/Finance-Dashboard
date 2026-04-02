package com.finance.dashboard.service;

import com.finance.dashboard.entity.FinancialRecord;

import java.util.List;

public interface FinancialService {

    public FinancialRecord createRecord(FinancialRecord record);
    public List<FinancialRecord> getAllRecords();
    public FinancialRecord getRecordById(Long id);
    public FinancialRecord updateRecord(Long id, FinancialRecord updatedRecord);
    public void deleteRecord(Long id);
}

package com.finance.dashboard.service.serviceImpl;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import com.finance.dashboard.repository.FinancialRecordRepository;
import com.finance.dashboard.service.FinancialService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FinancialServiceImpl implements FinancialService {

    private final FinancialRecordRepository financialRecordRepository;

    public FinancialServiceImpl(FinancialRecordRepository financialRecordRepository) {
        this.financialRecordRepository = financialRecordRepository;
    }


    @Override
    public FinancialRecord createRecord(FinancialRecord record) {
        return financialRecordRepository.save(record);
    }

    @Override
    public List<FinancialRecord> getAllRecords() {
        return financialRecordRepository.findAll();
    }

    @Override
    public FinancialRecord getRecordById(Long id) {
            return financialRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial record not found with id: " + id));
    }

    @Override
    public FinancialRecord updateRecord(Long id, FinancialRecord updatedRecord) {
        FinancialRecord record = financialRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial record not found with id: " + id));

        record.setAmount(updatedRecord.getAmount());
        record.setType(updatedRecord.getType());
        record.setCategory(updatedRecord.getCategory());
        record.setAmount(updatedRecord.getAmount());
        record.setDate(updatedRecord.getDate());
        record.setDescription(updatedRecord.getDescription());

        return financialRecordRepository.save(record);
    }

    @Override
    public List<FinancialRecord> filterRecords(RecordType type, Category category, LocalDate startDate, LocalDate endDate) {

        if (type != null && category != null && startDate != null && endDate != null) {
            return financialRecordRepository.findByTypeCategoryDate(type, category, startDate, endDate);
        }

        if (type != null) {
            return financialRecordRepository.findByType(type);
        }

        if (category != null) {
            return financialRecordRepository.findByCagtegory(category);
        }

        if (startDate != null && endDate != null) {
            return financialRecordRepository.findByDateRange(startDate, endDate);
        }

        return financialRecordRepository.findAll();
    }

    @Override
    public void deleteRecord(Long id) {

        FinancialRecord record = financialRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial record not found with id: " + id));
        financialRecordRepository.delete(record);
    }
}

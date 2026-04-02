package com.finance.dashboard.service.serviceImpl;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.repository.FinancialRecordRepository;
import com.finance.dashboard.service.FinancialService;
import org.springframework.stereotype.Service;

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
    public void deleteRecord(Long id) {

        FinancialRecord record = financialRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial record not found with id: " + id));
        financialRecordRepository.delete(record);
    }
}

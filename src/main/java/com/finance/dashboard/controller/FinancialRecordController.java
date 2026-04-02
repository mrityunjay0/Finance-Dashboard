package com.finance.dashboard.controller;

import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import com.finance.dashboard.service.FinancialService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/records")
public class FinancialRecordController {

    private final FinancialService financialService;

    public FinancialRecordController(FinancialService financialService) {
        this.financialService = financialService;
    }


    @PostMapping("/create")
    public FinancialRecord createRecord(@RequestBody FinancialRecord record) {
        return financialService.createRecord(record);
    }

    @GetMapping("/filter")
    public List<FinancialRecord> getRecords(
            @RequestParam(required = false) RecordType type,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return financialService.filterRecords(type, category, startDate, endDate);
    }

    @GetMapping("/all")
    public List<FinancialRecord> getAllRecords() {
        return financialService.getAllRecords();
    }

    @GetMapping("/{id}")
    public FinancialRecord getRecordById(@PathVariable Long id) {
        return financialService.getRecordById(id);
    }

    @PutMapping("/update/{id}")
    public FinancialRecord updateRecord(@PathVariable Long id, @RequestBody FinancialRecord updatedRecord) {
        return financialService.updateRecord(id, updatedRecord);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteRecord(@PathVariable Long id) {
        financialService.deleteRecord(id);
    }
}

package com.finance.dashboard.controller;

import com.finance.dashboard.dto.FinancialRecordRequest;
import com.finance.dashboard.entity.FinancialRecord;
import com.finance.dashboard.enums.Category;
import com.finance.dashboard.enums.RecordType;
import com.finance.dashboard.service.FinancialService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<FinancialRecord> createRecord(
            @Valid @RequestBody FinancialRecordRequest request
    ) {
        FinancialRecord record = new FinancialRecord();
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDescription(request.getDescription());
        record.setDate(request.getDate());

        FinancialRecord saved = financialService.createRecord(record);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<FinancialRecord>> getRecords(
            @RequestParam(required = false) RecordType type,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return ResponseEntity.ok(
                financialService.filterRecords(type, category, startDate, endDate)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<List<FinancialRecord>> getAllRecords() {
        return ResponseEntity.ok(financialService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialRecord> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(financialService.getRecordById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FinancialRecord> updateRecord(
            @PathVariable Long id,
            @Valid @RequestBody FinancialRecordRequest request
    ) {
        FinancialRecord record = new FinancialRecord();
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDescription(request.getDescription());
        record.setDate(request.getDate());

        return ResponseEntity.ok(
                financialService.updateRecord(id, record)
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRecord(@PathVariable Long id) {
        financialService.deleteRecord(id);
        return ResponseEntity.ok("Record deleted successfully");
    }
}
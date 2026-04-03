-- Clear existing records (optional, use with care)
-- DELETE FROM financial_records;

-- Current Month Trends (Income)
INSERT INTO financial_records (amount, type, category, description, date) VALUES (50000.00, 'INCOME', 'SALARY', 'Monthly Salary - March', '2026-03-01');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (50000.00, 'INCOME', 'SALARY', 'Monthly Salary - February', '2026-02-01');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (50000.00, 'INCOME', 'SALARY', 'Monthly Salary - January', '2026-01-01');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (5000.00, 'INCOME', 'INVESTMENT', 'Stock Dividends', '2026-03-15');

-- Current Month Trends (Expenses)
INSERT INTO financial_records (amount, type, category, description, date) VALUES (15000.00, 'EXPENSE', 'UTILITIES', 'Rent Payment', '2026-03-05');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (2000.00, 'EXPENSE', 'FOOD', 'Grocery Shopping', '2026-03-10');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (1200.00, 'EXPENSE', 'TRANSPORTATION', 'Fuel Refill', '2026-03-12');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (3500.00, 'EXPENSE', 'ENTERTAINMENT', 'Dinner & Movie', '2026-03-20');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (800.00, 'EXPENSE', 'HEALTHCARE', 'Pharmacy', '2026-03-22');

-- Previous Month Trends (Expenses)
INSERT INTO financial_records (amount, type, category, description, date) VALUES (15000.00, 'EXPENSE', 'UTILITIES', 'Rent Payment', '2026-02-05');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (4000.00, 'EXPENSE', 'EDUCATION', 'Online Course', '2026-02-15');
INSERT INTO financial_records (amount, type, category, description, date) VALUES (2500.00, 'EXPENSE', 'FOOD', 'Weekly Groceries', '2026-02-20');

LOAD DATA INFILE './data/health-insurance-fund/data.csv'
INTO TABLE health_insurance_fund
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@col1) set name=@col1;
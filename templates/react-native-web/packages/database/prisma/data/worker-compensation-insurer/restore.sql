LOAD DATA INFILE './data/worker-compensation-insurer/data.csv'
INTO TABLE worker_compensation_insurer
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@col1) set name=@col1;
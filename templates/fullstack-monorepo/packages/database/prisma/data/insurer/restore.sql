LOAD DATA INFILE './data/insurer/data.csv'
INTO TABLE insurer
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@col1) set name=@col1;
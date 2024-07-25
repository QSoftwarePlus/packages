LOAD DATA INFILE './data/car/data.csv'
INTO TABLE cars
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"' LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS
(@col1,@col2,@col3,@col4) set make=@col1,model=@col2,version=@col3,locale=@col4;
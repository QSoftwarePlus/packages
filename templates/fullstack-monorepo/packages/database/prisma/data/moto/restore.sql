LOAD DATA INFILE './data/moto/data.csv'
INTO TABLE motos
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"' LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS
(@col1,@col2,@col3,@col4) set make=@col1,model=@col2,version=@col3,locale=@col4;
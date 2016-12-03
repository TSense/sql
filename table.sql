CREATE TABLE tsense.dbo.data
(
    device CHAR(17),
    timestamp DATETIME,
    temperature FLOAT,
    humidity FLOAT
)
CREATE TABLE tsense.dbo.config
(
    temp_min FLOAT,
    temp_max FLOAT,
    interval INT
)
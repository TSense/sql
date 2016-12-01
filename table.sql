CREATE TABLE tsense.dbo.data
(
    device CHAR(17) NOT NULL,
    timestamp DATETIME NOT NULL,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL
)
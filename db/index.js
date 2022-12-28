const mysql = require("mysql");

// 创建数据库连接池对象
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root1234",
  database: "my_db_01",
});

module.exports = db;

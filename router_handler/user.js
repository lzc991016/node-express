const db = require("../db/index");
const bcrypt = require("bcryptjs");
// 导入生成token的包
const jwt = require("jsonwebtoken");
const config = require("../config");
exports.regUser = (req, res) => {
  const userInfo = req.body;
  // 输入为空
  if (!userInfo.username || !userInfo.password) {
    // return res.send({ status: 1, message: "用户名或密码不合法" });
    return res.cc("用户名或密码不合法");
  }
  db.query(
    "select * from ev_users where username = ?",
    userInfo.username,
    function (err, results) {
      // sql语句执行失败
      if (err) {
        return res.cc(err);
      }
      // 名字被占用
      if (results.length > 0) {
        return res.cc("用户名被占用");
      }
    }
  );
  // password加密
  userInfo.password = bcrypt.hashSync(userInfo.password, 10);
  // 注册成功
  db.query(
    "insert into ev_users set ?",
    {
      username: userInfo.username,
      password: userInfo.password,
    },
    (err, results) => {
      if (err) return res.cc(err);
      // 判断影响行数是否为1
      if (results.affectedRows !== 1) return res.cc("注册用户失败");
      return res.cc("注册成功", 0);
    }
  );
};

exports.login = (req, res) => {
  const userInfo = req.body;
  db.query(
    "select * from ev_users where username=?",
    userInfo.username,
    (err, results) => {
      // sql语句执行失败
      if (err) return res.cc(err);
      // 执行sql语句成功，但是获取的数据条数不等于1
      if (results.length !== 1) return res.cc("登录失败");
      // 判断密码是否正确
      const compareResult = bcrypt.compareSync(
        userInfo.password,
        results[0].password
      );
      if (!compareResult) return res.cc("登录失败，密码错误");
      // 在服务器端生成token字符串
      const user = { ...results[0], password: "", user_pic: "" };
      const tokenStr = jwt.sign(user, config.JwtsecretKey, {
        expiresIn: config.expiresIn,
      });
      res.send({
        status: 0,
        message: "登录成功！",
        token: "Bearer " + tokenStr,
      });
    }
  );
};

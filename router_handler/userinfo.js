// 用户个人信息处理函数
const db = require("../db/index");
const bcrypt = require("bcryptjs");

// 获取个人信息
exports.getUserInfo = (req, res) => {
  db.query(
    "select id,username,nickname,email,user_pic from ev_users where id=?",
    req.user.id,
    (err, results) => {
      if (err) return res.cc(err);
      if (results.length != 1) return res.cc("查询个人信息失败");
      res.send({
        status: 0,
        message: "查询成功",
        data: results[0],
      });
    }
  );
};
// 修改个人信息
exports.updateUserInfo = (req, res) => {
  db.query(
    "update ev_users set ? where id=?",
    [req.body, req.body.id],
    (err, results) => {
      if (err) return res.cc(err);
      console.log(results);
      if (results.affectedRows !== 1) return res.cc("用户信息更新失败");
      res.cc("用户信息更新成功", 0);
    }
  );
};
// 重置密码
exports.updatePassword = (req, res) => {
  db.query("select * from ev_users where id=?", req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("用户不存在！");
    // 判断密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("旧密码错误");
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    db.query(
      "update ev_users set password=? where id=?",
      [newPwd, req.user.id],
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("重置密码失败！");
        res.cc("重置密码成功！", 0);
      }
    );
  });
};
// 修改头像
exports.updateAvatar = (req, res) => {
  db.query(
    "update ev_users set user_pic=? where id=?",
    [req.body.avatar, req.user.id],
    (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("更新头像失败");
      res.cc("更换头像成功！", 0);
    }
  );
};

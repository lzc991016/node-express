const db = require("../db/index");

// 获取文章分类
exports.getArticleCates = (req, res) => {
  db.query(
    "select * from ev_article_cate where is_delete=0 order by id asc",
    (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        massage: "获取文章分类数据成功！",
        data: results,
      });
    }
  );
};
// 添加文章分类
exports.addArticleCates = (req, res) => {
  // 分类名称和分类别名是否被占用
  db.query(
    "select * from ev_article_cate where name=? or alias=?",
    [req.body.name, req.body.alias],
    (err, results) => {
      if (err) return res.cc(err);
      // 分类名称和分类别名都被占用
      if (results.length === 2) return res.cc("分类名称与分类别名都被占用");
      if (
        results.length === 1 &&
        results[0].name === req.body.name &&
        results[0].alias === req.body.alias
      )
        return res.cc("分类名称与分类别名都被占用");
      // 分类名称或分类别名被占用
      if (results.length === 1 && results[0].name === req.body.name)
        return res.cc("分类名称被占用");
      if (results.length === 1 && results[0].alias === req.body.alias)
        return res.cc("分类别名被占用");
    }
  );
  db.query("insert into ev_article_cate set ?", req.body, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("添加文章分类失败！");
    res.cc("添加文章分类成功！", 0);
  });
};
// 删除文章分类
exports.deleteCateById = (req, res) => {
  db.query(
    "update ev_article_cate set is_delete=1 where id=?",
    req.params.id,
    (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("删除文章分类失败！");
      res.cc("删除文章分类成功", 0);
    }
  );
};
// 根据id获取文章分类
exports.getArtCateById = (req, res) => {
  db.query(
    "select * from ev_article_cate where id=?",
    req.params.id,
    (err, results) => {
      if (err) return res.cc(err);
      if (results.length !== 1) return res.cc("获取文章分类信息失败！");
      res.send({
        status: 0,
        massage: "获取文章分类成功！",
        data: results,
      });
    }
  );
};
exports.updateCateById = (req, res) => {
  const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`;
  db.query(
    sql,
    [req.body.id, req.body.name, req.body.alias],
    (err, results) => {
      if (err) return res.cc(err);
      // 分类名称和分类别名都被占用
      if (results.length === 2) return res.cc("分类名称与分类别名被占用！");
      if (
        results.length === 1 &&
        results[0].name === req.body.name &&
        results[0].alias === req.body.alias
      )
        return res.cc("分类名称与分类别名都被占用");
      // 分类名称或分类别名被占用
      if (results.length === 1 && results[0].name === req.body.name)
        return res.cc("分类名称被占用");
      if (results.length === 1 && results[0].alias === req.body.alias)
        return res.cc("分类别名被占用");
      // 跟新文章分类
      db.query(
        "update ev_article_cate set ? where id=?",
        [req.body, req.body.id],
        (err, results) => {
          if (err) return res.cc(err);
          if (results.affectedRows !== 1) return res.cc("文章分类更新失败！");
          res.cc("文章分类更新成功！", 0);
        }
      );
    }
  );
};

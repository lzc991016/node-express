// 导入express
const express = require("express");
const cors = require("cors");
// 导入joi来校验规则
const joi = require("joi");
const userRouter = require("./router/user");
const userinfoRouter = require("./router/userinfo");
const artcateRouter = require("./router/artcate");
const articleRouter = require("./router/article");
// 解析token的包
const expressJWT = require("express-jwt");
const config = require("./config");
// 创建express实例
const app = express();

// 使用中间件
app.use(cors());
app.use(express.urlencoded({ extended: false })); //express内置中间件

// 自定义中间件
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 一定要在路由之前配置解析token的中间件
app.use(
  expressJWT({ secret: config.JwtsecretKey }).unless({ path: [/^\/api/] })
);

// 使用路由模块
app.use("/api", userRouter);
app.use("/my", userinfoRouter);
app.use("/my/article", artcateRouter);
app.use("/my/article", articleRouter);

// 定义错误级别中间件
app.use((err, req, res, next) => {
  // 验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败");
  // 未知的错误
  res.cc(err);
});

// 监听服务器
app.listen(3000, () => {
  console.log("http://127.0.0.1:3000");
});

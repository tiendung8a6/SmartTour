import JWT from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Xác thực tài khoản không thành công.");
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    next("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
  }
};

export default authMiddleware;

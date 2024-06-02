import Koa from "koa";
import cors from "@koa/cors";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import OpenAI from "openai";

dotenv.config();
const myCache = new NodeCache();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const categories = [
  "làm",
  "xem",
  "ăn",
  "uống",
  "mua",
  "biết",
  "tránh",
  "mang theo",
  "mặc",
];

const getThingsToDo = (place) => {
  const capitalizedPlace = place.charAt(0).toUpperCase() + place.slice(1);
  const categoriesListString = categories.join(", ");

  const cachedValue = myCache.get(capitalizedPlace);
  if (cachedValue != undefined) {
    return Promise.resolve(cachedValue);
  }

  return openai.chat.completions
    .create({
      messages: [
        {
          role: "system",
          content:
            "Bạn là một trợ lý hữu ích được thiết kế để cung cấp kết quả dưới dạng JSON.",
        },
        {
          role: "user",
          content: `Những điều cần ${categoriesListString} cụ thể ở ${capitalizedPlace}.
            Trả về một đối tượng JSON với các khóa: ${categoriesListString} và giá trị là các danh sách chuỗi với tối thiểu 5 và tối đa 10 mục.
            Cố gắng làm cho số lượng ký tự trong mỗi danh sách càng giống nhau càng tốt.
            Thêm một biểu tượng cảm xúc tương ứng vào đầu mỗi mục trong danh sách và thêm khoảng cách sau biểu tượng cảm xúc.`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    })
    .then((response) => {
      const data = response.choices[0].message.content;
      myCache.set(capitalizedPlace, data);

      return data;
    });
};

export const travelAI = async (req, res, next) => {
  const app = new Koa();

  app.use(cors());

  app.use(async (ctx) => {
    try {
      const place = decodeURIComponent(req.params.place);
      ctx.response.status = 200;
      ctx.response.message = "OK";
      ctx.response.body = await getThingsToDo(place);
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.message = "Internal Server Error";
      ctx.response.body = { error };
    }
  });

  await app.callback()(req, res);
};

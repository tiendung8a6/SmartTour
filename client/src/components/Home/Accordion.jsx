import React, { useRef, useState } from "react";

const Accordion = ({ question, answer }) => {
  const answerElRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [answerHeight, setAnswerHeight] = useState("0px");

  const toggleAccordion = () => {
    const answerElHeight = answerElRef.current.scrollHeight;
    setIsOpen(!isOpen);
    setAnswerHeight(isOpen ? "0px" : `${answerElHeight}px`);
  };

  return (
    <div
      className="space-y-3 mt-5 overflow-hidden border-b"
      onClick={toggleAccordion}
    >
      <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
        <p className="dark:text-gray-300">{question}</p>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </h4>
      <div
        ref={answerElRef}
        className="duration-300"
        style={{ height: answerHeight }}
      >
        <div>
          <p className="text-gray-500 dark:text-gray-400">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default () => {
  const faqsList = [
    {
      q: "SmartTour là gì?",
      a: "SmartTour là một trang web cung cấp thông tin về điểm đến và lập kế hoạch du lịch.",
    },
    {
      q: "Làm thế nào để liên hệ với SmartTour khi cần hỗ trợ?",
      a: "Bạn có thể liên hệ với chúng tôi thông qua trang web ở phần liên hệ hoặc qua các thông tin liên lạc được cung cấp để nhận được sự hỗ trợ sớm nhất.",
    },
    {
      q: "Website du lịch SmartTour có biện pháp bảo mật thông tin cá nhân của người dùng như thế nào?",
      a: "SmartTour cam kết bảo mật thông tin cá nhân của người dùng theo các tiêu chuẩn cao nhất. Chúng tôi sử dụng các biện pháp bảo vệ dữ liệu như mã hóa SSL để đảm bảo rằng mọi thông tin cá nhân của người dùng được bảo vệ an toàn khi truyền tải trên mạng. Ngoài ra, chúng tôi không bao giờ chia sẻ thông tin cá nhân của khách hàng với bất kỳ bên thứ ba nào mà không có sự đồng ý.",
    },
    {
      q: "Làm thế nào để viết một bài blog chia sẻ trải nghiệm du lịch trên SmartTour?",
      a: "Để viết blog chia sẻ trải nghiệm du lịch trên SmartTour, bạn có thể đăng nhập vào tài khoản của mình và truy cập vào phần Trang cá nhân trên trang web. Tại đây, bạn sẽ tìm thấy nút Đăng bài để bắt đầu viết bài của mình.",
    },
    {
      q: "Làm thế nào để tìm thông tin về các điểm đến du lịch trên SmartTour?",
      a: "Để tìm thông tin về các điểm đến du lịch trên SmartTour, bạn có thể truy cập vào trang chủ hoặc sử dụng chức năng tìm kiếm trên trang web. Tại đây, bạn có thể nhập tên địa điểm bạn quan tâm.",
    },
  ];

  return (
    <section className="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl text-gray-800 font-semibold dark:text-white">
          Câu Hỏi Thường Gặp
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto text-lg dark:text-gray-400">
          Đã trả lời tất cả các câu hỏi thường gặp, Vẫn còn băn khoăn? Hãy liên
          hệ với chúng tôi.
        </p>
      </div>
      <div className="mt-14 max-w-2xl mx-auto dark:text-gray-400">
        {faqsList.map((item, idx) => (
          <Accordion key={idx} question={item.q} answer={item.a} />
        ))}
      </div>
    </section>
  );
};

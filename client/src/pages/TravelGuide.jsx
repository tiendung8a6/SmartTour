import { useState } from "react";
import PropTypes from "prop-types";

const getRandomLoadingMessage = (place) => {
  const capitalizedPlace = place.charAt(0).toUpperCase() + place.slice(1);

  const messages = [
    `Khám phá những điều tốt nhất ở ${capitalizedPlace}...`,
    `Tìm kiếm những hoạt động tốt nhất tại ${capitalizedPlace}...`,
    `Tìm kiếm những địa điểm tốt nhất để ghé thăm ở ${capitalizedPlace}...`,
    `Tìm kiếm những điều tốt nhất để làm ở ${capitalizedPlace}...`,
    `Tìm kiếm những địa điểm tốt nhất để đến ở ${capitalizedPlace}...`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};

const Header = ({ place, setPlace, handleSearch }) => (
  <header>
    <div className="prose">
      <h1 className="mt-0 mb-6 font-bold text-gray-900 text-center text-3xl dark:text-white">
        Hướng dẫn du lịch với AI hỗ trợ
      </h1>
    </div>
    <div className="flex">
      <input
        type="text"
        placeholder="Tôi đang đi đến..."
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="dark:bg-white dark:text-black text-black flex-grow min-w-0 px-4 py-2 mr-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        className="px-4 py-2 text-lg text-white bg-sky-500 hover:bg-sky-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        onClick={() => handleSearch()}
      >
        Khám phá
      </button>
    </div>
  </header>
);

Header.propTypes = {
  place: PropTypes.string.isRequired,
  setPlace: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

const Recommendations = ({ place, isLoading, recommendations }) => {
  if (isLoading) {
    return <p className="mt-10">⌛️ {getRandomLoadingMessage(place)}</p>;
  }

  if (recommendations) {
    const hasData = Object.values(recommendations).some(
      (list) => list.length > 0
    );

    if (!hasData) {
      return (
        <p className="mt-10">⚠️ Hệ thống đang bảo trì. Vui lòng thử lại sau.</p>
      );
    }

    return (
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(recommendations).map(([title, list]) => (
          <div key={title} className="prose">
            <h2 className="mt-0 mb-4 font-bold text-gray-900 dark:text-white">
              AI khuyên bạn nên {title}
            </h2>
            <ul className="list-none pl-0 dark:text-gray-300">
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

Recommendations.propTypes = {
  place: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  recommendations: PropTypes.object,
};

const About = () => {
  const aboutLists = [
    {
      title: "🌎 Khám Phá Thế Giới",
      items: [
        "- Tìm những điều tốt nhất để làm ở bất kỳ thành phố nào, từ tham quan đến ẩm thực.",
        "- Khám phá những địa điểm ẩn dật và những trải nghiệm ngoài lề.",
      ],
    },
    {
      title: "🎯 Đạt Được Mục Tiêu",
      items: [
        "- Tiết kiệm thời gian lập kế hoạch cho chuyến đi.",
        "- Khám phá những địa điểm và trải nghiệm mới mà bạn không thể tìm thấy một mình.",
        "- Tận dụng tối đa thời gian trong các chuyến đi.",
      ],
    },
    {
      title: "🤖 Được Hỗ Trợ Bởi Trí Tuệ Nhân Tạo",
      items: [
        "- Những gợi ý của chúng tôi được huấn luyện trên hàng triệu đánh giá và bài viết.",
        "- Quan trọng nhất, nó hoàn toàn miễn phí!",
      ],
    },
  ];

  return (
    <div className="grid mt-10 gap-8 lg:grid-cols-3">
      {aboutLists.map(({ title, items }) => (
        <div key={title} className="prose">
          <h2 className="mt-0 mb-4 font-bold text-gray-900 dark:text-sky-500">
            {title}
          </h2>
          <ul className="pl-5 dark:text-gray-400">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const getThingsToDo = (place) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  // return fetch(`https://thingsto-api.glitch.me/${place}`, {
  return fetch(`${REACT_APP_API_URL}/ai/${place}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

function TravelGuide() {
  const [place, setPlace] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const handleSearch = () => {
    setIsLoading(true);
    getThingsToDo(place).then((response) => {
      setRecommendations(response);
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10 px-8">
        <Header place={place} setPlace={setPlace} handleSearch={handleSearch} />
        {recommendations || isLoading ? (
          <Recommendations
            place={place}
            isLoading={isLoading}
            recommendations={recommendations}
          />
        ) : (
          <About />
        )}
      </div>
    </div>
  );
}

export default TravelGuide;

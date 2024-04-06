import { useState } from "react";
import PropTypes from "prop-types";

const getRandomLoadingMessage = (place) => {
  const capitalizedPlace = place.charAt(0).toUpperCase() + place.slice(1);

  const messages = [
    `Discovering the best things to do in ${capitalizedPlace}...`,
    `Unveiling the hidden gems of ${capitalizedPlace}...`,
    `Finding the best activities in ${capitalizedPlace}...`,
    `Searching for the best places to visit in ${capitalizedPlace}...`,
    `Looking for the best things to do in ${capitalizedPlace}...`,
    `Finding the best places to go in ${capitalizedPlace}...`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};

const Header = ({ place, setPlace, handleSearch }) => (
  <header>
    <div className="prose">
      <h1 className="mt-0 mb-6 font-bold text-gray-900 text-center text-3xl">
        AI-Powered Travel Guide
      </h1>
    </div>
    <div className="flex">
      <input
        type="text"
        placeholder="I'm going to..."
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="flex-grow min-w-0 px-4 py-2 mr-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        className="px-4 py-2 text-lg text-white bg-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => handleSearch()}
      >
        Explore
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
    return (
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations &&
          Object.entries(recommendations).map(([title, list]) => (
            <div key={title} className="prose">
              <h2 className="mt-0 mb-4 font-bold text-gray-900">
                Things to {title}
              </h2>
              <ul className="list-none pl-0">
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
      title: "🌎 Explore the World",
      items: [
        "Find the best things to do in any city, from sightseeing to dining",
        "Discover hidden gems and off-the-beaten-path experiences",
      ],
    },
    {
      title: "🎯 Hit the Target",
      items: [
        "Save time planning your trip",
        "Discover new places and experiences you wouldn't have found on your own",
        "Make the most of your time in trips",
      ],
    },
    {
      title: "🤖 Powered by AI",
      items: [
        "Our AI-powered recommendations are trained on millions of reviews and articles",
        "Best of all, it's completely free!",
      ],
    },
  ];

  return (
    <div className="grid mt-10 gap-8 lg:grid-cols-3">
      {aboutLists.map(({ title, items }) => (
        <div key={title} className="prose">
          <h2 className="mt-0 mb-4 font-bold text-gray-900">{title}</h2>
          <ul className="pl-5">
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
  return fetch(`https://thingsto-api.glitch.me/${place}`, {
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

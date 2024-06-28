import React, { useState, useEffect } from "react";
import axios from "axios";

const Policy = () => {
  const [policyData, setPolicyData] = useState(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/policy`
        );
        setPolicyData(response.data);
      } catch (error) {
        console.error("Error fetching policy data:", error);
      }
    };
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    fetchPolicyData();
  }, []);

  return (
    <div className=" h-full pt-10">
      <main className="relative mx-auto px-15 md:max-w-screen-md">
        <article className="text-gray-800">
          {policyData && policyData.success ? (
            <>
              <h2
                id="section-one"
                className="mb-4 text-3xl font-bold text-center dark:text-white"
              >
                {policyData.data[0].title}
              </h2>
              <p
                className="mb-10 text-base text-gray-600 text-justify dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: policyData.data[0].content }}
              ></p>
            </>
          ) : (
            <p>Đang tải...</p>
          )}
        </article>
      </main>
    </div>
  );
};

export default Policy;

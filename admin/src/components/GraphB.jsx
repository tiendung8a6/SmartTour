// import React from "react";
// import {
//   Area,
//   AreaChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GraphB = ({ dt }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      {dt?.length > 0 ? (
        <BarChart data={dt}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            type="monotone"
            dataKey="Total"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </BarChart>
      ) : (
        <img
          src="https://user-images.githubusercontent.com/15953522/49493502-63e21d00-f882-11e8-911c-1d7655f393e8.png"
          alt="No Data"
          className="w-full h-full opacity-50"
        />
      )}
    </ResponsiveContainer>
  );
};

export default GraphB;

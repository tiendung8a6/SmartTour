import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const GraphA = ({ dt }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      {dt?.length > 0 ? (
        <AreaChart data={dt}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#0EA5E9"
            fill="#0EA5E9"
          />
        </AreaChart>
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

export default GraphA;

import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = ({ dt }) => {
  return (
    <ResponsiveContainer width={"100%"} height={500} className="mt-5">
      <LineChart
        width={500}
        height={300}
        data={dt}
        margin={{
          top: 5,
          right: 5,
          left: 50,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        <XAxis dataKey="_id" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Total" stroke="#0088FE" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;

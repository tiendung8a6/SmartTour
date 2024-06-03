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

const data = [
  { label: "Tháng 1", income: 5000, expense: 3200 },
  { label: "Tháng 2", income: 5200, expense: 3200 },
  { label: "Tháng 3", income: 5500, expense: 3500 },
  { label: "Tháng 4", income: 4800, expense: 2900 },
  { label: "Tháng 5", income: 5100, expense: 3100 },
  { label: "Tháng 6", income: 5300, expense: 3300 },
  { label: "Tháng 7", income: 5400, expense: 3400 },
  { label: "Tháng 8", income: 5600, expense: 3600 },
  { label: "Tháng 9", income: 5700, expense: 3700 },
  { label: "Tháng 10", income: 5900, expense: 3900 },
  { label: "Tháng 11", income: 6000, expense: 4000 },
  { label: "Tháng 12", income: 6200, expense: 4200 },
];

const Chart = () => {
  return (
    <ResponsiveContainer width={"100%"} height={500} className="mt-5">
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        <XAxis dataKey="label" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={"income"} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;

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
      {dt?.length > 0 ? (
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

export default Chart;

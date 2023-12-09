import _ from "lodash";
import dayjs from "dayjs";
import {
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useLocalStorage } from "@uidotdev/usehooks";

const colorList = [
  "#9e0142",
  // "#d53e4f",
  "#f46d43",
  // "#fdae61",
  "#fee08b",
  // "#e6f598",
  "#abdda4",
  // "#66c2a5",
  "#3288bd",
  // "#5e4fa2",
];

const convertToTornTime = (time, tz) => {
  if (tz < 0) {
    // console.log(' time.add(tz, "hour").unix()', time.add(tz, "hour").unix());
    return time.add(Math.abs(tz), "hour");
  } else if (tz > 0) {
    return time.subtract(Math.abs(tz), "hour");
  } else {
    return time.unix();
  }
};

export const AttackTimeChart = ({ attacksFromOpponents }) => {
  const [timezone] = useLocalStorage("tcTimezone", 0);
  const chartDataMap = attacksFromOpponents.map((item) => {
    const time = dayjs(item.timestamp_started * 1000);
    const tornTime = convertToTornTime(time, timezone);
    let hour = tornTime.hour() + (tornTime.minute() > 30 ? 1 : 0);
    if (hour === 24) hour = 0;
    return {
      hour,
      respect: item.respect,
      attacker: item.attacker_name || "STEALTHED",
    };
  });
  const attackers = Object.keys(_.groupBy(chartDataMap, "attacker"));
  const chartData = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ].map((hour) => {
    const temp = {};
    for (let attacker of attackers) {
      temp[attacker] = chartDataMap.filter((item) => {
        return item.hour === hour && item.attacker === attacker;
      }).length;
    }
    return {
      hour,
      ...temp,
    };
  });

  return (
    <div>
      <div
        style={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "2rem" }}
      >
        OPPONENTS'S HITS TIME
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid />
          <XAxis dataKey="hour" unit="h" />
          <YAxis />
          {/* <ZAxis type="number" dataKey="z" range={[60, 400]} name="score" unit="km" /> */}
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          {attackers.map((item, index) => {
            return (
              <Bar
                dataKey={item}
                unit=" attacks"
                stackId="a"
                fill={colorList[index]}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

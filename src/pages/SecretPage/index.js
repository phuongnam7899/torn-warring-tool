import React, { useEffect, useState } from "react";
import "./style.css";
import _ from "lodash";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const accounts = [
  {
    name: "nklm",
    apiKey: "uJPLgjHzQDkwjgG3",
    type: "main",
  },
  {
    name: "Ta0TenThai",
    apiKey: "wZbuQPquBug5oGso",
    type: "main",
  },
  {
    name: "namkhonglanman",
    apiKey: "ko3335xZlTYSJ1in",
    type: "support",
  },
  {
    name: "the_employee",
    apiKey: "CoHfQC2sKHjbWuoP",
    type: "support",
  },
];
const accountsByName = _.groupBy(accounts, "name");
let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatTime = (sec) => {
  const minutesDiff = dayjs().diff(dayjs().subtract(sec, "seconds"), "minutes");
  const hourDiff = Math.floor(minutesDiff / 60);
  const minuteLeft = minutesDiff % 60;
  if (hourDiff > 0) {
    return `${hourDiff}h ${minuteLeft}min`;
  }
  return `${minuteLeft}min`;
};
export const SecretPage = () => {
  const [usersData, setUsersData] = useState({});
  const [lastUpdated, setLastUpdated] = useState();
  const fetchData = async () => {
    let fetchedUsers = {};
    for (let i = 0; i < accounts.length; i++) {
      const response = await fetch(
        `https://api.torn.com/user/?selections=bars,cooldowns,education,jobpoints,money,travel&key=${accounts[i].apiKey}`
      );
      const data = await response.json();
      fetchedUsers = {
        ...fetchedUsers,
        [accounts[i].name]: data,
      };
    }
    setLastUpdated(dayjs().format("HH:mm"));
    setUsersData(fetchedUsers);
  };
  // const fetchExpense = async () => {
  //   const response = await fetch(
  //     `https://api.torn.com/user/?selections=log&key=${accounts[0].apiKey}`
  //   );
  //   const data = await response.json();
  //   console.log("data", data);
  // };
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1000 * 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        style={{
          paddingLeft: "1rem",
          fontSize: "2rem",
          fontWeight: "900",
          marginBottom: "1rem",
        }}
      >
        LUA: {lastUpdated}
      </div>
      <div className="container">
        {Object.keys(usersData).map((userName) => {
          const userData = usersData[userName];
          const cash = _.get(userData, "money_onhand");
          const energy = _.get(userData, "energy.current");
          const energyFullTimeLeft = _.get(userData, "energy.fulltime");
          const nerve = _.get(userData, "nerve.current");
          const drugCd = _.get(userData, "cooldowns.drug");
          const boosterCd = _.get(userData, "cooldowns.booster");
          const travelTimeLeft = _.get(userData, "travel.time_left");
          const educationTimeLeft = _.get(userData, "education_timeleft");
          const jobPoints = _.get(userData, "jobpoints.companies.jobpoints");
          const bankTimeLeft = _.get(userData, "city_bank.time_left");
          return (
            <div className="one-user">
              <div className="name">{userName}</div>
              <div className="section">
                <div className="section-name">Status</div>
                <div className={`line ${cash > 100000 ? "red" : ""}`}>
                  Cash: {USDollar.format(cash)}
                </div>
                <div
                  className={`line ${energyFullTimeLeft < 600 ? "red" : ""}`}
                >
                  Energy: {energy} ({formatTime(energyFullTimeLeft)})
                </div>
                <div className={`line ${nerve > 25 ? "red" : ""}`}>
                  Nerve: {nerve}
                </div>
              </div>
              <div className="section">
                <div className="section-name">Cooldowns</div>
                <div className={`line ${drugCd < 600 ? "red" : ""}`}>
                  Drug CD: {formatTime(drugCd)}
                </div>
                <div className={`line ${boosterCd < 600 ? "red" : ""}`}>
                  Booster CD: {formatTime(boosterCd)}
                </div>
                <div className={`line ${travelTimeLeft < 600 ? "red" : ""}`}>
                  Flight Time: {formatTime(travelTimeLeft)}
                </div>
                <div
                  className={`line ${educationTimeLeft < 86400 ? "red" : ""}`}
                >
                  Education: {formatTime(educationTimeLeft)}
                </div>
                <div className="line">Job Points: {jobPoints}</div>
                <div className={`line ${bankTimeLeft < 3600 ? "red" : ""}`}>
                  Bank: {formatTime(bankTimeLeft)}
                </div>
                {/* <div
                className={`line ${
                  rentDayLeft < 5 || upkeep > 1000000 ? "red" : ""
                }`}
              >
                Properties: {rentDayLeft} days ({USDollar.format(upkeep)}{" "}
                upkeep)
              </div> */}
              </div>
              {/* <div className="section">
              <div className="section-name">Unread Message</div>
              <div className="line">Xans: 20 min</div>
              <div className="line">Med Kits: 20</div>
            </div> */}
            </div>
          );
        })}
      </div>
      {/* <div>
        Income vs Expense
        <button
          type="button"
          onClick={() => {
            fetchExpense();
          }}
        >
          Fetch
        </button>
      </div> */}
    </div>
  );
};

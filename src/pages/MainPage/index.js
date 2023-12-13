import React, { useEffect, useState } from "react";
import { AttackTimeChart } from "../../components/AttackTimeChart";
import { HitMadeAndGot } from "../../components/HitMadeAndGot";
import { OpponentStatsEstimate } from "../../components/OpponentStatsEstimate";
import { useLocalStorage } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import { BestTargets } from "../../components/BestTargets";

// 17 14

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const availableFactions = [
  "Nova Gypsy Jokers",
  "Shaggy Hi-Fidelity",
  "Undecided Haven",
  "Seshlehem",
  "Dark Carnival",
  "The Aristocrats",
  "WARTORN",
].map((item) => {
  return item.toLocaleLowerCase();
});
const goldenCustomers = [
  "Nova Gypsy Jokers",
  "Shaggy Hi-Fidelity",
  "Undecided Haven",
  "Seshlehem",
];

const convertToTimezone = (time, tz) => {
  if (tz > 0) {
    // console.log(' time.add(tz, "hour").unix()', time.add(tz, "hour").unix());
    return time.add(Math.abs(tz), "hour").unix();
  } else if (tz < 0) {
    return time.subtract(Math.abs(tz), "hour").unix();
  } else {
    return time.unix();
  }
};
export const MainPage = () => {
  const [attacks, setAttacks] = useState([]);
  const [warStartTime] = useLocalStorage("tcStartTime", null);
  const [warEndTime] = useLocalStorage("tcEndTime", null);
  const [yourFactionName] = useLocalStorage("tcYourFactionName", "");
  const [opponentFactionName] = useLocalStorage("tcOpponentFactionName", "");
  const [factionMembers] = useLocalStorage("tcFactionMember", "{}");
  const [factionMemberObject, setFactionMemberObject] = useState(
    JSON.parse(factionMembers)
  );
  const [timezone] = useLocalStorage("tcTimezone", 0);
  const [opponents, setOpponents] = useState([]);

  const warStartTimeByTimezone = convertToTimezone(
    dayjs(warStartTime * 1000),
    Number(timezone)
  );
  const warEndTimeByTimezone = convertToTimezone(
    dayjs(warEndTime * 1000),
    Number(timezone)
  );
  const fetchAttacks = async () => {
    let data = [];
    const step = Math.round(
      (warEndTimeByTimezone - warStartTimeByTimezone) / 2
    );
    let newMemberObj = { ...factionMemberObject };
    for (let i = 0; i < Object.keys(factionMemberObject).length; i++) {
      for (let j = 1; j <= 2; j++) {
        const response = await fetch(
          `https://api.torn.com/user/?selections=attacks,battlestats&key=${
            factionMemberObject[Object.keys(factionMemberObject)[i]].key
          }&from=${warStartTimeByTimezone + (j - 1) * step}&to=${
            warStartTimeByTimezone + j * step
          }`
        );
        const fetchData = await response.json();
        data = [...data, ...Object.values(fetchData.attacks)];
        const { defense, strength, dexterity, speed } = fetchData;
        newMemberObj = {
          ...newMemberObj,
          [Object.keys(factionMemberObject)[i]]: {
            str: strength,
            spe: speed,
            dex: dexterity,
            def: defense,
          },
        };
        await sleep(1000);
      }
      setFactionMemberObject(newMemberObj);
    }
    setAttacks(data);
  };
  useEffect(() => {
    if (
      !warStartTime ||
      !yourFactionName ||
      !opponentFactionName ||
      factionMembers === "{}"
    )
      window.location = "/setting";
    availableFactions.includes(yourFactionName.toLocaleLowerCase().trim()) &&
      fetchAttacks();
  }, []);
  const attacksFromOpponents = attacks.filter((item) => {
    return (
      item.attacker_factionname === opponentFactionName ||
      item.attacker_factionname === ""
    );
  });
  const opponentHits = attacks.filter((item) => {
    return (
      item.attacker_factionname === opponentFactionName &&
      item.result !== "Lost"
    );
  });
  const hitsMade = attacks.filter((item) => {
    return (
      item.attacker_factionname === yourFactionName && item.result !== "Lost"
    );
  });

  if (!availableFactions.includes(yourFactionName.toLocaleLowerCase().trim()))
    return (
      <div>
        Your faction hasn't been allowed to access the tool yet, contact{" "}
        <a
          style={{ color: "blue" }}
          href="https://www.torn.com/profiles.php?XID=3077555"
          target="_blank"
        >
          nklm
        </a>{" "}
        for more information
      </div>
    );

  if (goldenCustomers.includes(opponentFactionName)) {
    return (
      <div>
        Your opponent faction is my special customer, tool cannot be used with
        them
      </div>
    );
  }

  return (
    <>
      {attacks.length ? (
        <>
          <AttackTimeChart attacksFromOpponents={attacksFromOpponents} />
          <HitMadeAndGot opponentHits={opponentHits} hitsMade={hitsMade} />
          <OpponentStatsEstimate
            attacks={attacks}
            factionMembers={factionMemberObject}
            yourFactionName={yourFactionName}
            opponentFactionName={opponentFactionName}
            setOpponents={setOpponents}
          />
          <BestTargets
            opponents={opponents}
            hitsMade={hitsMade}
            factionMembers={factionMemberObject}
          />
        </>
      ) : (
        <>
          Please wait {Object.keys(factionMemberObject).length * 2} seconds
          because Torn limit the API calls per minute (Do not close this tab).
          If it takes too longer than{" "}
          {Object.keys(factionMemberObject).length * 2} seconds, please recheck
          your setting, then contact me for support
        </>
      )}
    </>
  );
};

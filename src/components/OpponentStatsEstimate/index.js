import { useEffect } from "react";
import _ from "lodash";
import { NumberFormat } from "../../App";

export const OpponentStatsEstimate = ({
  attacks,
  factionMembers,
  yourFactionName,
  opponentFactionName,
  setOpponents,
}) => {
  const opponents = attacks
    .reduce((result, item) => {
      if (item.defender_factionname === yourFactionName) {
        if (
          !!item.attacker_name &&
          item.attacker_factionname !== opponentFactionName
        )
          return result;
        return [...result, item.attacker_name || "STEALTH"];
      } else if (
        item.attacker_factionname === yourFactionName &&
        item.defender_factionname === opponentFactionName
      ) {
        return [...result, item.defender_name || "STEALTH"];
      } else return result;
    }, [])
    .filter((item) => item !== "STEALTH");
  const factionMemberAverageStat =
    Object.values(factionMembers).reduce((total, item) => {
      return total + item.str + item.def + item.dex + item.spe;
    }, 0) / Object.keys(factionMembers).length;
  const stealthedAttackNumber = attacks
    .reduce((result, item) => {
      if (item.defender_factionname === yourFactionName) {
        if (
          !!item.attacker_name &&
          item.attacker_factionname !== opponentFactionName
        )
          return result;
        return [...result, item.attacker_name || "STEALTH"];
      } else if (
        item.attacker_factionname === yourFactionName &&
        item.defender_factionname === opponentFactionName
      ) {
        return [...result, item.defender_name || "STEALTH"];
      } else return result;
    }, [])
    .filter((item) => item === "STEALTH").length;
  const uniqOpponents = _.uniq(opponents);
  const findMinStats = (opponentName) => {
    const attacksInvolveOpponent = attacks.filter((item) => {
      return (
        item.attacker_name === opponentName ||
        item.defender_name === opponentName
      );
    });
    const attackOpponentMade = attacks.filter((item) => {
      return item.attacker_name === opponentName;
    });
    // console.log("opponentName", opponentName);
    const estimatedStats = attacksInvolveOpponent.map((attack) => {
      const fairFight = attack.modifiers.fair_fight;
      let opponentTotalStats = 0;
      if (attack.attacker_factionname === yourFactionName) {
        const { str, def, spe, dex } = factionMembers[attack.attacker_name];
        // console.log("{ str, def, spe, dex }", { str, def, spe, dex });
        const ourBattleScore =
          Math.sqrt(str) + Math.sqrt(def) + Math.sqrt(dex) + Math.sqrt(spe);
        const opponentBattleScore =
          ourBattleScore * ((fairFight - 1) / (8 / 3));
        opponentTotalStats = (opponentBattleScore * opponentBattleScore) / 4;
      } else {
        const { str, def, spe, dex } = factionMembers[attack.defender_name];
        const ourBattleScore =
          Math.sqrt(str) + Math.sqrt(def) + Math.sqrt(dex) + Math.sqrt(spe);
        const opponentBattleScore =
          ourBattleScore / ((fairFight - 1) / (8 / 3));
        opponentTotalStats = (opponentBattleScore * opponentBattleScore) / 4;
      }
      return Math.round(opponentTotalStats);
    });
    const uniqueTotalStat = _.uniq(
      estimatedStats.filter((item) => item !== Infinity && item !== 0)
    );
    // console.log("uniqueTotalStat", uniqueTotalStat);
    const average = _.sum(uniqueTotalStat) / uniqueTotalStat.length;
    return {
      min: Math.min(
        ...estimatedStats.filter((item) => item !== Infinity && item !== 0)
      ),
      max: Math.max(
        ...estimatedStats.filter((item) => item !== Infinity && item !== 0)
      ),
      average,
      attacksInvolveCount: attacksInvolveOpponent.length,
      energyUsed: 25 * attackOpponentMade.length,
    };
  };
  const tableData = uniqOpponents.map((opponent) => {
    const { min, max, average, attacksInvolveCount, energyUsed } =
      findMinStats(opponent);
    return {
      name: opponent,
      energyUsed,
      min,
      max,
      average,
      attacksInvolveCount,
    };
  });
  const numberOfOpponentsStrongerThanAverage = tableData.filter((item) => {
    return item.average > factionMemberAverageStat * 1.5;
  }).length;
  const eliteEnergyUsedBonus =
    Math.round(stealthedAttackNumber / numberOfOpponentsStrongerThanAverage) *
    25;
  useEffect(() => {
    setOpponents(tableData);
  }, [tableData]);
  return (
    <div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginTop: "2rem",
          marginBottom: "0.5rem",
        }}
      >
        OPPONENTS STATS (ESTIMATED)
      </div>
      <div>
        There're <b>{stealthedAttackNumber} stealthed attacks</b> and{" "}
        <b>{numberOfOpponentsStrongerThanAverage} of their members</b> are
        stronger than 1.5 of your faction average stats. Each of them will be
        added <b>{eliteEnergyUsedBonus}e</b> to energy used
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attacks Involved</th>
            <th>Energy Used (Estimate)</th>
            <th>Min Total Stats</th>
            <th>Max Total Stats</th>
            <th>Average Total Stats</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => {
            const isElite = item.average > factionMemberAverageStat * 1.5;
            return (
              <tr>
                <td>{item.name}</td>
                <td>{item.attacksInvolveCount}</td>
                <td>
                  {item.energyUsed + (isElite ? eliteEnergyUsedBonus : 0)}
                </td>
                <td>{NumberFormat.format(Math.round(item.min))}</td>
                <td>{NumberFormat.format(Math.round(item.max))}</td>
                <td>{NumberFormat.format(Math.round(item.average))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

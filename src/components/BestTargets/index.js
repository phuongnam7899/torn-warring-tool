import { useLocalStorage } from "@uidotdev/usehooks";
import _ from "lodash";
import { useEffect } from "react";
import "./styles.css";

export const BestTargets = ({ opponents, hitsMade, factionMembers }) => {
  const [opponentFactionName] = useLocalStorage("tcOpponentFactionName", "");
  const hitMadeGroupByName = _(hitsMade)
    .filter(
      (item) =>
        item.defender_factionname === opponentFactionName &&
        ![10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000].includes(
          item.chain
        ) &&
        item.respect_gain > 2
    )
    .uniqWith((first, second) => {
      return (
        first.attacker_name === second.attacker_name &&
        first.defender_name === second.defender_name
      );
    })
    .orderBy("respect_gain", "desc")
    .groupBy("attacker_name")
    .value();
  const membersNames = Object.keys(hitMadeGroupByName);
  useEffect(() => {
    console.log("hitMadeGroupByName", hitMadeGroupByName);
  }, []);
  const opponentsSortedByStats = _.orderBy(opponents, "average", "desc");
  const bestTargetsByStats = membersNames.reduce((result, current) => {
    const { str, def, spe, dex } = factionMembers[current];
    const memberTotalStats = str + def + spe + dex;
    return {
      ...result,
      [current]: {
        stats: memberTotalStats,
        weakerOpponents: opponentsSortedByStats.filter(
          (item) =>
            item.average <= (memberTotalStats * 90) / 100 &&
            item.average >= (memberTotalStats * 7.5) / 100
        ),
      },
    };
  }, {});

  return (
    <div>
      <div
        style={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "2rem" }}
      >
        BEST TARGETS
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Best Targets Hitted</th>
            <th>Best Target By Stats</th>
          </tr>
        </thead>
        <tbody>
          {membersNames.map((item) => {
            const value =
              ((item.hitsMadeCount - item.hitsGotCount) / item.hitsMadeCount) *
              100;
            return (
              <tr>
                <td>{item}</td>
                <td>
                  {hitMadeGroupByName[item].map((hitItem, index) => {
                    return (
                      <div
                        className={
                          hitItem.respect_gain > 3.5 ? "best-target" : ""
                        }
                      >
                        #{index + 1}. {hitItem.defender_name} ( +
                        {hitItem.respect_gain} )
                      </div>
                    );
                  })}
                </td>
                <td>
                  {bestTargetsByStats[item].weakerOpponents.map(
                    (target, index) => {
                      return (
                        <div className={index < 3 ? "best-target" : ""}>
                          #{index + 1}. {target.name} ({" "}
                          {(
                            (target.average / bestTargetsByStats[item].stats) *
                            100
                          ).toFixed(1)}
                          % total stats )
                        </div>
                      );
                    }
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

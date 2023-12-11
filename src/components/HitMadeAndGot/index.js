import _ from "lodash";
import "./styles.css";
export const HitMadeAndGot = ({ hitsMade, opponentHits }) => {
  const hitMadeGroupByName = _.groupBy(hitsMade, "attacker_name");
  const hitGotGroupByName = _.groupBy(opponentHits, "defender_name");
  const membersNames = Object.keys(hitGotGroupByName);
  const tableData = membersNames.map((item) => {
    return {
      name: item,
      hitsMadeCount: (hitMadeGroupByName[item] || []).length,
      hitsGotCount: (hitGotGroupByName[item] || []).length,
    };
  });
  const respectEffectivenessGot = (name) => {
    const hitsMade = hitMadeGroupByName[name] || [];
    const hitsGot = hitGotGroupByName[name] || [];
    const respGot = hitsMade.reduce((sum, item) => {
      return sum + item.respect;
    }, 0);
    const respLoss = hitsGot.reduce((sum, item) => {
      return sum + item.respect;
    }, 0);
    return {
      netRespectEarned: respGot - respLoss,
      effectivenessByResp: (((respGot - respLoss) / respGot) * 100).toFixed(1),
    };
  };
  return (
    <div>
      <div
        style={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "2rem" }}
      >
        OUR MEMBERS' EFFECTIVENESS
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Hits Made</th>
            <th>Incoming Hits</th>
            <th>Effectiveness By Hits</th>
            <th>Net Respects Earned (Gained - Lost)</th>
            <th>Effectiveness By Respects</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => {
            const value =
              ((item.hitsMadeCount - item.hitsGotCount) / item.hitsMadeCount) *
              100;
            const { effectivenessByResp, netRespectEarned } =
              respectEffectivenessGot(item.name);
            return (
              <tr>
                <td>{item.name}</td>
                <td>{item.hitsMadeCount}</td>
                <td>{item.hitsGotCount}</td>
                <td className={value > 50 ? "good" : "bad"}>
                  {value.toFixed(1)}%
                </td>
                <td>{netRespectEarned.toFixed(1)}</td>
                <td className={value > 50 ? "good" : "bad"}>
                  {effectivenessByResp}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

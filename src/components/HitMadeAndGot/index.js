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
  return (
    <div>
      <div
        style={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "2rem" }}
      >
        OUR RECENTLY EFFECTIVENESS
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Hits Made</th>
            <th>Incoming Hits</th>
            <th>Effectiveness</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => {
            const value =
              ((item.hitsMadeCount - item.hitsGotCount) / item.hitsMadeCount) *
              100;
            return (
              <tr>
                <td>{item.name}</td>
                <td>{item.hitsMadeCount}</td>
                <td>{item.hitsGotCount}</td>
                <td className={value > 50 ? "good" : "bad"}>
                  {value.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

import Rect, { useState } from "react";
import "./index.css";
import { useLocalStorage } from "@uidotdev/usehooks";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import dayjs from "dayjs";
// const initFactionMembers = {
//   nklm: {
//     key: "uJPLgjHzQDkwjgG3",
//   },
//   Ta0TenThai: {
//     key: "wZbuQPquBug5oGso",
//   },
//   LeonQi: {
//     key: "YYg7HNjNvZ0bLzQv",
//   },
//   ERT_: {
//     key: "LwGEkcn98lkjdZFf",
//   },
// };

export const SettingPage = () => {
  const [startTime, setStartTime] = useLocalStorage("tcStartTime", null);
  const [endTime, setEndTime] = useLocalStorage("tcEndTime", dayjs().unix());
  const [yourFactionName, setYourFactionName] = useLocalStorage(
    "tcYourFactionName",
    ""
  );
  const [opponentFactionName, setOpponentFactionName] = useLocalStorage(
    "tcOpponentFactionName",
    ""
  );
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberKey, setNewMemberKey] = useState("");
  const [factionMembers, setFactionMember] = useLocalStorage(
    "tcFactionMember",
    "{}"
  );
  const [timezone, setTimezone] = useLocalStorage("tcTimezone", 0);
  const factionMembersObject = JSON.parse(factionMembers);

  return (
    <div>
      {" "}
      <h1>General Information</h1>
      <p>
        Please <b>make sure there's not any redundant spaces</b> after the
        faction name
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "50%",
          maxWidth: "500px",
          justifyContent: "space-between",
        }}
      >
        <TextField
          id={"your-faction-name"}
          label="Your faction name"
          variant="outlined"
          value={yourFactionName}
          onChange={(e) => {
            setYourFactionName(e.target.value);
          }}
        />
        <b>vs</b>
        <TextField
          id={"opponent-faction-name"}
          label="Opponent faction name"
          variant="outlined"
          value={opponentFactionName}
          onChange={(e) => {
            setOpponentFactionName(e.target.value);
          }}
        />
      </div>
      <h1>Select War Time</h1>
      <TextField
        id={"time-zone"}
        label="Your Timezone (ex: 7, -6, 4, -3,...)"
        variant="outlined"
        type="number"
        value={timezone}
        onChange={(e) => {
          setTimezone(e.target.value);
        }}
      />
      <p>
        Start time should be the time that war start (Torn Time) (Or you can
        choose another day if want)
      </p>
      <p>
        End time should be now, which will be default value (Or you can choose
        another day if want)
      </p>
      <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "50%",
          maxWidth: "550px",
          justifyContent: "space-between",
        }}
      >
        <DateTimePicker
          label="Start Time"
          value={dayjs(startTime * 1000)}
          onChange={(newStart) => {
            setStartTime(newStart.unix());
          }}
          maxDate={dayjs()}
        />
        <b>to</b>
        <DateTimePicker
          label="End Time"
          value={dayjs(endTime * 1000)}
          defaultValue={dayjs()}
          onChange={(newEnd) => {
            setEndTime(newEnd.unix());
          }}
          maxDate={dayjs()}
        />
      </div>
      <h1>Faction Members' API Keys</h1>
      <p>
        Only <b>Limited Access</b> API key is required
      </p>
      <p>
        Make sure you <b>input correct API keys</b> and there's{" "}
        <b>no redundant spaces</b> after member's name or API keys
      </p>
      <p>
        The more members you add, the more accurate the report will be
        (Especially the stats estimation an the attacks time)
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>API Key</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(factionMembersObject).map((memberName) => {
            return (
              <tr>
                <td>{memberName}</td>
                <td>
                  <TextField
                    id={memberName}
                    variant="outlined"
                    value={factionMembersObject[memberName].key}
                    onChange={(e) => {
                      setFactionMember(
                        JSON.stringify({
                          ...factionMembersObject,
                          [memberName]: { key: e.target.value },
                        })
                      );
                    }}
                  />
                </td>
                <td>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => {
                      const { [memberName]: _, ...newObj } =
                        factionMembersObject;
                      setFactionMember(JSON.stringify(newObj));
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
          <tr style={{ backgroundColor: "#f7fff5" }}>
            <td>
              <TextField
                id={"new-member-name"}
                variant="outlined"
                value={newMemberName}
                placeholder="New member name..."
                onChange={(e) => {
                  setNewMemberName(e.target.value);
                }}
              />
            </td>
            <td>
              <TextField
                id={"new-member"}
                variant="outlined"
                placeholder="New member API key..."
                value={newMemberKey}
                onChange={(e) => {
                  setNewMemberKey(e.target.value);
                }}
              />
            </td>
            <td>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                disabled={!newMemberName || !newMemberKey}
                onClick={() => {
                  setFactionMember(
                    JSON.stringify({
                      ...factionMembersObject,
                      [newMemberName]: { key: newMemberKey },
                    })
                  );
                  setNewMemberKey("");
                  setNewMemberName("");
                }}
              >
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <Button
        onClick={() => {
          window.location = "/";
        }}
        size="large"
        style={{ marginTop: "1rem", marginBottom: "2rem" }}
        color="primary"
        variant="outlined"
        disabled={
          factionMembers === "{}" ||
          !startTime ||
          !endTime ||
          !yourFactionName ||
          !opponentFactionName
        }
      >
        View Report
      </Button>
    </div>
  );
};

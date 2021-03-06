import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasksAction, runTask } from "../actions/actions";
import DataTable from "./Iis/DataTable";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";

const TasksPanel = props => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks);
  useEffect(() => {
    if (!tasks.loaded) {
      dispatch(getTasksAction());
    }
  }, [dispatch, tasks.loaded]);
  const actions = [
    rowData => ({
      icon: () =>
        rowData.state === "Ready" ? <PlayArrowIcon /> : <StopIcon />,
      tooltip: "Run Task",
      onClick: (event, row) => dispatch(runTask(row.name)),
      hidden: rowData.state === "Active"
    })
  ];

  return (
    <DataTable {...tasks} title="Scheduled Tasks" extraColumns={actions} />
  );
};

export default TasksPanel;

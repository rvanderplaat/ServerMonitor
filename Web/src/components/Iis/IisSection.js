import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import * as actions from "../../actions/actions";
import AppPoolList from "./AppPoolList";
import NoteControl from "./NoteControl";
import StartStopButton from "./StartStopButton";
import ApplicationStatus from "./ApplicationStatus";
import ActionPanel from "./ActionPanel";

class IisSection extends Component {
  render() {
    const location = this.props.iisData.homeUrl
      .split("/")
      .splice(0, 4)
      .join("/");
    return (
      <React.Fragment>
        <ReactTable
          showPagination={false}
          noDataText='No IIS applications found'
          sortable={false}
          minRows={1}
          data={this.props.iisData.data}
          defaultSorted={[{ id: "key" }]}
          className="-highlight"
          getTdProps={() => ({
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }
          })}
          columns={[
            {
              Header: "Name",
              accessor: "name",
              Cell: row => (
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`${location}/${row.original.name}/`}
                >
                  {row.original.name}
                </a>
              )
            },
            {
              Header: "State",
              accessor: "state",
              className: "state",
              Cell: row => (
                <ApplicationStatus org={row.original} running={row.original.running} text={row.original.state} />
              ),
              width: 100
            },
            {
              Header: "Note",
              accessor: "note",
              Cell: row => (
                <NoteControl
                  click={this.props.set}
                  org={row.original}
                  url={location}
                  refresh={this.props.refresh}
                />
              ),
              width: 310
            },
            {
              Header: "Actions",
              accessor: "x",
              Cell: row => (
                <ActionPanel
                  click={this.props.set}
                  org={row.original}
                  url={location}
                  refresh={this.props.refresh}
                  running={row.original.running}
                  whitelisted={row.original.whitelisted}
                />
              ),
              width: 100
            }
          ]}
          SubComponent={row => (
            <AppPoolList
              click={this.props.set}
              org={row.original}
              url={location}
              refresh={this.props.refresh}
              items={row.original.apps}
              recycle={this.props.recycle}
            />
          )}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  iis: state.table
});

const mapDispatchToProps = dispatch => ({
  recycle: (name, url) => dispatch(actions.recycleApp(name, url)),
  set: (item, url, refresh, action) => {
    const data = {
      build: item,
      action: action
    };
    dispatch(actions.setIisAction(data, url));
    refresh(true);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IisSection);

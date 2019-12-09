import React, { useState, useEffect } from "react";
// import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
// import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
// import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import "./Home.css";
import Button from '@material-ui/core/Button';


export default function Home(props) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        // const notes = await loadNotes();
        const notes = {noteId: 1, content: "klasmdldkasd", createdAt: "24.01.2019"};
        setNotes(notes);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [props.isAuthenticated]);

  function loadNotes() {
    // return API.get("notes", "/notes");
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        // <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
        //   <ListGroupItem header={note.content.trim().split("\n")[0]}>
        //     {"Created: " + new Date(note.createdAt).toLocaleString()}
        //   </ListGroupItem>
        // </LinkContainer>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      ) : (
        <Button variant="contained" color="primary">
          Hello World
        </Button>
        // <LinkContainer key="new" to="/notes/new">
        //   <ListGroupItem>
        //     <h4>
        //       <b>{"\uFF0B"}</b> Create a new note
        //     </h4>
        //   </ListGroupItem>
        // </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        {/* <PageHeader>Your Notes</PageHeader> */}
        <Button>Your Notes</Button>
        {/* <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup> */}
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}

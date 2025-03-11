import React, { useContext, useState, useEffect, useRef } from "react";
import NoteContext from "../context/notes/NoteContext";
import Notesitem from "./Notesitem";
import AddNote from "../models/AddNote";
import EditNote from "../models/EditNotes";
import ErrorNotification from "./ErrorNotification";
import "./note.css";
import { useHistory } from "react-router-dom";

function Notes() {
  let history = useHistory();

  const notescontext = useContext(NoteContext);
  const {
    allnotes,
    notes,
    deleteNote,
    getusername,
    userName,
    Error,
    setError,
    isLoading,
  } = notescontext;

  const [isModelOpen, setisModelOpen] = useState(false);
  const [delisvisible, setdelisvisible] = useState(false);
  const [iseditopen, setIseditopen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTitles, setShowTitles] = useState(false);

  const dropdownRef = useRef(null); // Ref for the dropdown
  const searchBarRef = useRef(null); // Ref for the search bar

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      allnotes();
      getusername();
    } else {
      history.push("/signup");
    }
  }, []);

  const [delid, setdelid] = useState(null);
  const [deltitle, setDeltitle] = useState(null);
  const deletenoteid = (id, title, isvisible) => {
    setdelid(id);
    setDeltitle(title);
    setdelisvisible(isvisible);
  };

  const [editingtitle, seteditingtitle] = useState("");
  const [editingdescription, setEditingdescription] = useState("");
  const [editingid, seteditingid] = useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    setShowTitles(!showTitles);
  };

  const handleTitleClick = (title) => {
    setSearchTerm(title);
    setShowTitles(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowTitles(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="notesitem-bg">
      {Error && <ErrorNotification message={Error} onClose={handleCloseError} />}
      <div className="user-box d-inline">
        Welcome, <span className="user-name">{userName}</span>!
      </div>

      <div>
        {isLoading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}

        {!isLoading && notes.length === 0 && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <button
              type="button"
              onClick={() => setisModelOpen(true)}
              className="btn fristnotebutton"
            >
              Add Your first note
            </button>
          </div>
        )}

        {!isLoading && notes.length > 0 && (
          <>
            <div className="text-end me-3 mt-2 sticky-top z-1 ">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={handleSearchClick}
                  className="search-bar"
                  ref={searchBarRef} // Attach ref to search bar
                />
                {showTitles && (
                  <div className="titles-dropdown" ref={dropdownRef}>
                    {notes.map((note) => (
                      <div
                        key={note._id}
                        className="title-item"
                        onClick={() => handleTitleClick(note.title)}
                      >
                        {note.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setisModelOpen(true)}
                className="btn btn-dark"
              >
                Add a new note
              </button>
            </div>

            <div className="text-center fs-2 fw-bolder text-light">
              Your Notes
            </div>
            <div className={`note d-flex justify-content-evenly flex-wrap z-0`}>
              {filteredNotes.map((note) => (
                <Notesitem
                  key={note._id}
                  deletenoteid={deletenoteid}
                  note={note}
                  onEdit={(title, description, id) => {
                    seteditingtitle(title);
                    setEditingdescription(description);
                    seteditingid(id);
                    setIseditopen(true);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {delisvisible && (
        <div className="deletenote-modal modal">
          <div className="modal-dialog">
            <div className="deletenote-modal-content modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete: {deltitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setdelisvisible(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    deleteNote(delid);
                    setdelisvisible(false);
                  }}
                  className="btn btn-secondary"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setdelisvisible(false)}
                  className="btn btn-primary"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddNote isOpen={isModelOpen} onClose={() => setisModelOpen(false)} />

      {iseditopen && (
        <EditNote
          onClose={() => setIseditopen(false)}
          title={editingtitle}
          description={editingdescription}
          id={editingid}
        />
      )}
    </div>
  );
}

export default Notes;
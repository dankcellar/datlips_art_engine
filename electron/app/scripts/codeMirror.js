import { basicSetup, EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { python } from "@codemirror/lang-javascript";

let language = new Compartment();
let tabSize = new Compartment();

let state = EditorState.create({
  extensions: [
    basicSetup,
    language.of(python()),
    tabSize.of(EditorState.tabSize.of(8)),
  ],
});

let view = new EditorView({
  state,
  parent: document.getElementById("editor-container"),
});

function setTabSize(view, size) {
  view.dispatch({
    effects: tabSize.reconfigure(EditorState.tabSize.of(size)),
  });
}

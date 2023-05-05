import firebase from "../firebase";

const db = firebase.ref("/prompts");

class PromptService {
  getAll() {
    return db;
  }

  create(prompt) {
    return db.push(prompt);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new PromptService();

import 'firebase/database';
import fbDatabase from "../firebase";
import { date_format_mmddyyyy } from '../utils/dates';

const db = fbDatabase.ref("/prompts");

class PromptService {
  getAll() {
    return db;
  }

  create(prompt) {
    const timestamp = date_format_mmddyyyy(Date.now());
    return db.push({ timestamp, ...prompt});
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

// Create instance before export [ best practice apparently? ]
const Service = new PromptService()
export default Service

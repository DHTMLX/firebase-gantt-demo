import "./style.css";
import { linksCollection, tasksCollection, db } from "./firebase";
import { onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, getDocs } from "firebase/firestore";
import { gantt } from "dhtmlx-gantt";
//import "../dhtmlx-gantt/codebase/dhtmlxgantt";

const { remoteUpdates } = gantt.ext.liveUpdates;

window.addEventListener("DOMContentLoaded", () => {
  gantt.config.auto_scheduling = true;

  const strToDate = gantt.date.str_to_date("%d-%m-%Y");
  const dateToStr = gantt.date.date_to_str("%d-%m-%Y");
  gantt.templates.parse_date = function (date) {
    if (!(date instanceof Date)) {
      date = strToDate(date);
    }
    return date;
  };
  gantt.templates.format_date = function (date) {
    return dateToStr(date);
  };

  gantt.init("gantt_here");

  const tasksQuery = query(tasksCollection);
  const linksQuery = query(linksCollection);

  (async () => {
    const tasksSnap = await getDocs(tasksQuery);
    const bulkTasks = tasksSnap.docs.map(processTask);
    const linksSnap = await getDocs(linksQuery);
    const bulkLinks = linksSnap.docs.map(processLink);

    gantt.parse({ tasks: bulkTasks, links: bulkLinks });
    watchRealtime();
  })();

  function processTask(docSnapshot) {
    const task = docSnapshot.data();
    task.id = docSnapshot.id;

    ["start_date", "end_date"].forEach((field) => {
      if (task[field]) {
        try {
          const date = gantt.templates.parse_date(task[field]);
          task[field] = date;
        } catch (e) {
          console.error(`Error processing ${field}:`, e);
          task[field] = null;
        }
      }
    });
    return task;
  }

  function processLink(docSnapshot) {
    const link = docSnapshot.data();
    link.id = docSnapshot.id;

    return link;
  }

  const watchRealtime = () => {
    let tasksLoaded = false;
    let linksLoaded = false;

    const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
      if (!tasksLoaded) {
        tasksLoaded = true;
        return;
      }

      handleRealtimeUpdates(querySnapshot, "task");
    });

    const unsubscribeLinks = onSnapshot(linksQuery, (querySnapshot) => {
      if (!linksLoaded) {
        linksLoaded = true;
        return;
      }
      handleRealtimeUpdates(querySnapshot, "link");
    });

    gantt.attachEvent("onDestroy", () => {
      unsubscribeLinks();
      unsubscribeTasks();
    });
  };

  const handleRealtimeUpdates = (querySnapshot, type) => {
    if (gantt.$destroyed) return;

    querySnapshot.docChanges().forEach((change) => {
      if (change.doc.metadata.hasPendingWrites) return;

      const processDataActions = {
        task: (data) => processTask(data),
        link: (data) => processLink(data),
      };

      const actions = {
        task: {
          added: (task) => remoteUpdates.events({ action: "add-task", type: task }),
          modified: (task) => remoteUpdates.events({ action: "update-task", type: task }),
          removed: (task) => remoteUpdates.events({ action: "delete-task", type: task }),
        },
        link: {
          added: (link) => remoteUpdates.events({ action: "add-link", type: link }),
          modified: (link) => remoteUpdates.events({ action: "update-link", type: link }),
          removed: (link) => remoteUpdates.events({ action: "delete-link", type: link }),
        },
      };

      const data = processDataActions[type](change.doc);
      actions[type][change.type](data);
    });
  };

  gantt.createDataProcessor(async (entityType, action, data, id) => {
    const collection = entityType === "task" ? tasksCollection : linksCollection;
    const path = entityType === "task" ? "tasks" : "links";
    const ref = doc(db, path, id.toString());

    switch (action) {
      case "create": {
        const addedDoc = await addDoc(collection, data);
        return { action: "inserted", tid: addedDoc.id };
      }
      case "update": {
        await updateDoc(ref, data);
        return { action: "updated" };
      }
      case "delete": {
        await deleteDoc(ref);
        return { action: "deleted" };
      }
      default:
        return true;
    }
  });
});

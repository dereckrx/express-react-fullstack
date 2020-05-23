export function TaskRepo(db) {
  const addNewTask = async (task) => {
    let collection = db.collection(`tasks`);
    await collection.insertOne(task);
  };

  const updateTask = async (task) => {
    let { id, group, isComplete, name } = task;
    let collection = db.collection(`tasks`);
    if (group) {
      await collection.updateOne({ id }, { $set: { group } });
    }
    if (name) {
      await collection.updateOne({ id }, { $set: { name } });
    }
    if (isComplete !== undefined) {
      await collection.updateOne({ id }, { $set: { isComplete } });
    }
  };

  return {
    addNewTask,
    updateTask,
  };
}

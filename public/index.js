const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');

let editStatus = false;
let id ='';

const saveTask = (title, description) =>
  db.collection('Tasks').doc().set({
    title,
    description
  });

const getTask = (id) => db.collection('Tasks').doc(id).get();
const getTasks = (id) => db.collection('Tasks').doc(id).get();
const onGetTasks = (callback) => db.collection('Tasks').onSnapshot(callback);
const deleteTask = id => db.collection('Tasks').doc(id).delete();
const updateTask = (id, updateTask) => db.collection('Tasks').doc(id).update(updateTask)

window.addEventListener('DOMContentLoaded', async(e) => {
  onGetTasks((querySnapshot) => {
    taskContainer.innerHTML = ''
    querySnapshot.forEach(doc => {
      const task = doc.data();
      task.id = doc.id
      taskContainer.innerHTML += `<div class="card mt-2">
        <div class="card-header">
          <h5 class="text-center">${task.title}</h5>
        </div>
        <div class="card-body">
          <p class="card-text">${task.description}</p>
          <div class="text-right">
            <button class="btn btn-danger rounded btn-delete" data-id="${task.id}">Delete</button>
            <button class="btn btn-warning rounded btn-update" data-id="${task.id}">Edit</button>
          </div>
        </div>
      </div>`;

      const btnsDelete = document.querySelectorAll('.btn-delete');
      btnsDelete.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          await deleteTask(e.target.dataset.id);
        });
      });

      const btnsUpdate = document.querySelectorAll('.btn-update');
      btnsUpdate.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          
          editStatus = true;
          id = doc.id;

          taskForm['task-title'].value = task.title;
          taskForm['task-description'].value = task.description;
          taskForm['btn-task-form'].innerText = "Update";
        })
      })
    });
  });
});


taskForm.addEventListener('submit', async(e) => {
  e.preventDefault();
  const title = taskForm['task-title'];
  const description = taskForm['task-description']; 

  if(!editStatus){
    await saveTask(title.value, description.value);
  }else{
    await updateTask(id, {
      title: title.value,
      description: description.value
    });

    editStatus = false;
    id = '';
    taskForm['btn-task-form'].innerText = 'Save'
  }
  
  taskForm.reset(); 
  title.focus();
})
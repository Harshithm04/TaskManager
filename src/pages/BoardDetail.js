import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useParams, Link } from 'react-router-dom';

const BoardDetail = () => {
  const { boardId } = useParams();
  const [boardName, setBoardName] = useState('');
  const [lists, setLists] = useState([]); // always an array
  const [newListName, setNewListName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedListForTask, setSelectedListForTask] = useState('');
  const [error, setError] = useState(null);

  // Fetch board's name first (so we can display it)
  const fetchBoardName = async () => {
    try {
      const resp = await api.get(`boards/${boardId}/`);
      setBoardName(resp.data.name || '');
    } catch {
      setError('Could not load board name.');
    }
  };

  // Fetch all lists for this board, each with nested tasks if available
  const fetchLists = async () => {
    setError(null);
    try {
      const resp = await api.get(`lists/?board=${boardId}`);
      let fetchedLists = [];
      // Two possible shapes:
      if (Array.isArray(resp.data)) {
        fetchedLists = resp.data;
      } else if (Array.isArray(resp.data.results)) {
        fetchedLists = resp.data.results;
      }
      setLists(fetchedLists);
      if (fetchedLists.length > 0) {
        setSelectedListForTask(fetchedLists[0].id);
      } else {
        setSelectedListForTask('');
      }
    } catch {
      setError('Could not load lists.');
    }
  };

  useEffect(() => {
    fetchBoardName();
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newListName.trim()) return;

    try {
      await api.post('lists/', { name: newListName.trim(), board: boardId });
      setNewListName('');
      fetchLists();
    } catch {
      setError('Could not create list.');
    }
  };

  const handleDeleteList = async (listId) => {
    setError(null);
    if (!window.confirm('Delete this list and all its tasks?')) return;
    try {
      await api.delete(`lists/${listId}/`);
      fetchLists();
    } catch {
      setError('Could not delete list.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newTaskTitle.trim() || !selectedListForTask) return;

    try {
      await api.post('tasks/', {
        board: parseInt(boardId, 10),
        list: parseInt(selectedListForTask, 10),
        title: newTaskTitle.trim(),
      });
      setNewTaskTitle('');
      fetchLists();
    } catch {
      setError('Could not create task.');
    }
  };

  const toggleTaskCompleted = async (task) => {
    setError(null);
    try {
      await api.patch(`tasks/${task.id}/`, { completed: !task.completed });
      fetchLists();
    } catch {
      setError('Could not update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError(null);
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`tasks/${taskId}/`);
      fetchLists();
    } catch {
      setError('Could not delete task.');
    }
  };

  return (
    <div>
      <h2>
        <Link to="/dashboard">← Back to Dashboard</Link> | Board: {boardName}
      </h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Create New List */}
      <form onSubmit={handleCreateList} style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          required
        />
        <button type="submit" className="primary" style={{ marginLeft: '8px' }}>
          Add List
        </button>
      </form>

      {/* Create New Task */}
      {lists.length > 0 && (
        <form onSubmit={handleCreateTask} style={{ marginBottom: '24px' }}>
          <select
            value={selectedListForTask}
            onChange={(e) => setSelectedListForTask(e.target.value)}
            required
          >
            {lists.map((lst) => (
              <option key={lst.id} value={lst.id}>
                {lst.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
            style={{ marginLeft: '8px' }}
          />
          <button type="submit" className="primary" style={{ marginLeft: '8px' }}>
            Add Task
          </button>
        </form>
      )}

      {/* Lists & Tasks */}
      {lists.length === 0 ? (
        <p>No lists yet. Create one above.</p>
      ) : (
        lists.map((lst) => (
          <div key={lst.id} style={{ marginBottom: '32px' }}>
            <h3>
              {lst.name}{' '}
              <button
                className="danger"
                style={{ marginLeft: '12px', fontSize: '14px' }}
                onClick={() => handleDeleteList(lst.id)}
              >
                Delete List
              </button>
            </h3>
            {(Array.isArray(lst.tasks) && lst.tasks.length > 0) ? (
              <ul>
                {lst.tasks.map((task) => (
                  <li key={task.id} style={{ marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(task)}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                    <button
                      className="danger"
                      style={{ marginLeft: '12px', fontSize: '12px' }}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks in this list.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BoardDetail;

import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);     // will always be an array
  const [newBoardName, setNewBoardName] = useState('');
  const [error, setError] = useState(null);

  const fetchBoards = async () => {
    setError(null);
    try {
      const resp = await api.get('boards/');
      // resp.data might be { results: [...] } or [...] directly
      if (Array.isArray(resp.data)) {
        setBoards(resp.data);
      } else if (Array.isArray(resp.data.results)) {
        setBoards(resp.data.results);
      } else {
        // If neither shape, reset to empty
        setBoards([]);
      }
    } catch (err) {
      setError('Failed to load boards.');
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newBoardName.trim()) return;

    try {
      await api.post('boards/', { name: newBoardName.trim() });
      setNewBoardName('');
      fetchBoards();
    } catch (err) {
      setError('Could not create board.');
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    if (!window.confirm('Delete this board? All its lists and tasks will be lost.')) return;
    try {
      await api.delete(`boards/${id}/`);
      fetchBoards();
    } catch (err) {
      setError('Could not delete board.');
    }
  };

  return (
    <div>
      <h2>Your Boards</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="New board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          required
        />
        <button type="submit" className="primary" style={{ marginLeft: '8px' }}>
          Create
        </button>
      </form>

      {boards.length === 0 ? (
        <p>You have no boards yet.</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board.id} style={{ marginBottom: '12px' }}>
              <Link to={`/boards/${board.id}`}>{board.name}</Link>{' '}
              <button
                className="danger"
                style={{ marginLeft: '12px' }}
                onClick={() => handleDelete(board.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;

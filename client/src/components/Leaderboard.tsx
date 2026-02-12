import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  userId: number;
  totalScore: number;
  user: {
    username: string;
  };
}

const Leaderboard = () => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Assuming the backend is running on localhost:3000
      const response = await fetch('http://localhost:3000/api/leaderboard/top');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const pollData = async () => {
      if (!isMounted) return;
      try {
        console.log('Polling data...');
        await fetchData();
      } finally {
        if (isMounted) {
          timeoutId = setTimeout(pollData, 5000);
        }
      }
    };

    pollData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading && data.length === 0) return <div className="loading">Loading...</div>;
  if (error && data.length === 0) return <div className="error">Error: {error}</div>;

  return (
    <div className="leaderboard-container">
      <h2>Top 10 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.userId}>
              <td>{index + 1}</td>
              <td>{entry.user.username}</td>
              <td>{entry.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="last-updated">
        Updates every 5 seconds
      </div>
    </div>
  );
};

export default Leaderboard;

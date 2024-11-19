import { useEffect, useState } from "react";

interface Room {
  _id: string;
  users: User[];
}
interface User {
  _id: string;
  name: string;
  email: string;
  ImageURL: string;
}
interface UseFriendDataResult {
  friend: User | null;
  loading: boolean;
  error: string | null;
}

const useFriendData = (roomId: string | null, authenticatedUserId: string): UseFriendDataResult => {
  const [friend, setFriend] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setFriend(null);
      return;
    }

    const fetchRoomData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/room/${roomId}`, {
          credentials: "include",
          method: "GET",
        });
        if (!response.ok) throw new Error("Failed to fetch room data");

        const room: Room = await response.json();
        const friendData = room.users.find((user) => user._id !== authenticatedUserId) || null;
        setFriend(friendData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, authenticatedUserId]);

  return { friend, loading, error };
};

export default useFriendData;

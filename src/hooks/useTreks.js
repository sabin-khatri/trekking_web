import { useState, useEffect } from 'react';
import { fetchTreks, fetchTrekById } from '../services/api';

export const useTreks = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTreks = async () => {
      try {
        setLoading(true);
        const data = await fetchTreks();
        setTreks(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch treks');
      } finally {
        setLoading(false);
      }
    };
    loadTreks();
  }, []);

  return { treks, loading, error };
};

export const useTrek = (id) => {
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrek = async () => {
      try {
        setLoading(true);
        const data = await fetchTrekById(id);
        setTrek(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch trek');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadTrek();
  }, [id]);

  return { trek, loading, error };
};

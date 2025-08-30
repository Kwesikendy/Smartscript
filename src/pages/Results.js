// This page has been replaced by the new results functionality in UploadsPage
// Users should be redirected to /uploads instead
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Results() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/uploads', { replace: true });
  }, [navigate]);
  
  return null;
}

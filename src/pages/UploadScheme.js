// This page has been replaced by the new SchemesPage component
// Users should be redirected to /schemes instead
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadScheme() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/schemes', { replace: true });
  }, [navigate]);
  
  return null;
}

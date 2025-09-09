import React from "react";
import EventForm from "../components/events/EventForm";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { BeamsBackground } from "../components/ui/beams-background";

const CreateEventPage = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <BeamsBackground intensity="medium" className="bg-slate-900">
      <div className="create-event-page">
        <EventForm />
      </div>
    </BeamsBackground>
  );
};

export default CreateEventPage;

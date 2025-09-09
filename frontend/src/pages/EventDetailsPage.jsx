import EventDetails from "../components/events/EventDetails";

const CreateEventPage = () => {
  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Create New Event
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Fill in the details below to create your event
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <EventDetails />
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";

function Tickets() {
  const dispatch = useDispatch();
  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    dispatch(getTickets()).then(() => setHasFetched(true));

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading || !hasFetched) return <Spinner />;

  if (isError) {
    return (
      <div>
        <h3 className="text-red-500">Error: {message}</h3>
        <BackButton url="/" />
      </div>
    );
  }

  return (
    <>
      <BackButton url="/" />
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Project</div>
          <div>Status</div>
          <div></div>
        </div>
        {tickets && tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketItem key={ticket._id} ticket={ticket} />
          ))
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </>
  );
}

export default Tickets;

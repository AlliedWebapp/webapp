import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";

function Tickets() {
  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div>
        <p>Error: {message}</p>
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
          <div>Product</div>
          <div>Status</div>
          <div></div>
        </div>
        {tickets.length > 0 ? (
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

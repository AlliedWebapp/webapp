// for page to view all tickets
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";

function Tickets() {
  const { tickets, isLoading, isSuccess } = useSelector(
    (state) => state.tickets
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (!tickets || tickets.length === 0) {
      dispatch(getTickets());
    }
  }, [dispatch, tickets]);
  
  if (isLoading) return <Spinner />;

  return (
    <>
      <BackButton url="/tickets" />
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Project</div>
          <div>Status</div>
          <div></div>
        </div>
        {tickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </>
  );
}

export default Tickets;

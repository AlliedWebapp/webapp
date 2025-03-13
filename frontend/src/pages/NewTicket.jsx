import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function NewTicket() {
  const { user} = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );

  const [projectname,setprojectname] = useState("");
  const [sitelocation,setsitelocation] = useState("");
  const [projectlocation,setprojectlocation] = useState("");
  const [fault,setfault] = useState("");
  const [issue,setissue] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState("");
  const [spare, setspare] = useState("");
  const [rating, setrating] = useState("");

  
 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate("/tickets");
    }
  }, [dispatch, isError, isSuccess, navigate, message]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createTicket({ projectname, description }));
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <BackButton url="/" />
      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Fill the details</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="projectname">Project Name</label>
          <select
              name="projectname"
              id="projectname"
              value={projectname}
              onChange={(e) => setprojectname(e.target.value)}
            >
              <option value="Shong">Shong</option>
              <option value="Solding">Solding</option>
              <option value="Jogini-II">Jogini-II</option>
              <option value="JHP Kuwarsi-II">JHP Kuwarsai</option>
              <option value="SDLLP Salun">SDLLP Salun</option>
            </select>
        </div>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="sitelocation">Site Location</label>
          <textarea
              className="form-control"
              placeholder=""
              value={sitelocation}
              name="Site Location"
              id="sitelocation"
              onChange={(e) => setsitelocation(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></textarea>
        </div>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="projectlocation">Project Location</label>
          <textarea
              className="form-control"
              placeholder=""
              value={projectlocation}
              name="Project Location"
              id="projectlocation"
              onChange={(e) => setprojectlocation(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></textarea>
        </div>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="fault">Fault</label>
          <textarea
              className="form-control"
              placeholder=""
              value={fault}
              name="Fault"
              id="fault"
              onChange={(e) => setfault(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></textarea>
        </div>
      </section>

      
      <section className="form">
        <div className="form-group">
          <label htmlFor="issue">Issue</label>
          <textarea
              className="form-control"
              placeholder=""
              value={issue}
              name="Issue"
              id="issue"
              onChange={(e) => setissue(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></textarea>
        </div>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
              className="form-control"
              placeholder=""
              value={description}
              name="Description"
              id="description"
              onChange={(e) => setdescription(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></textarea>
        </div>
      </section>


      <section className="form">
        <div className="form-group">
          <label htmlFor="date">Date to attend</label>
          <input
              type="date"
              className="form-control"
              placeholder=""
              value={date}
              name="Date to attend"
              id="date"
              onChange={(e) => setdate(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></input>
        </div>
      </section>




      <section className="form">
        <div className="form-group">
          <label htmlFor="spare">Spare Needed</label>
          <textarea
              className="form-control"
              placeholder=""
              value={spare}
              name="Spare Needed"
              id="spare"
              onChange={(e) => setspare(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></textarea>
        </div>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="rating">DG Rating</label>
          <textarea
              className="form-control"
              placeholder=""
              value={rating}
              name="DG Rating"
              id="rating"
              onChange={(e) => setrating(e.target.value)}
              style={{ width: "100%", height: "50px", resize: "none" }} 
            ></textarea>
        </div>
      </section>




  
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
    </>
  );
}

export default NewTicket;

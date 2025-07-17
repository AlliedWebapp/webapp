import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;
const PROJECTS = {
  Shong: "shong",
  Solding: "solding",
  "SDLLP Salun": "sdllpsalun",
  "JHP Kuwarsi-II": "kuwarsi",
  "Jogini-II": "jogini"
};

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );

  const [projectname, setprojectname] = useState("");
  const [sitelocation, setsitelocation] = useState("");
  const [projectlocation, setprojectlocation] = useState("");
  const [fault, setfault] = useState("");
  const [issue, setissue] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState("");
  const [spare, setspare] = useState("");
  const [rating, setrating] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spares, setSpares] = useState([]);
  const [sparesLoading, setSparesLoading] = useState(false);
  const [spareQuantity, setSpareQuantity] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
const sendEmailNotification = async () => {
  const formData = new FormData();

  // Set the subject dynamically
  formData.append("_subject", `New ticket created by project: ${projectname}`);

  
  const spareObj = spares.find(item => item._id === spare);
  const spareName = spareObj ? findItemNameField(spareObj, projectname) : 'Unknown Spare';

  // Create a custom details body
  const details = `
    Project Name: ${projectname}
Site Location: ${sitelocation}
Project Location: ${projectlocation}
Fault: ${fault}
Date to attend: ${date}
Spare Needed: ${spareName}
DG Rating: ${rating}
Spare Quantity: ${spareQuantity}
User Email: ${user?.email || ""}`;

  formData.append(" Ticket Details", details);
  formData.append("_captcha", "false");

  try {
    await fetch("https://formsubmit.co/alliedvercel@gmail.com", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
  } catch (error) {
    // handle error if needed
  }
};


  const findItemNameField = (item, collection) => {
    const fieldMappings = {
      jogini: [
        "Spare Discription",
      ],
      shong: [
        "Description of Material",
      ],
      solding: [
        "Description of Material",
      ],
      sdllpsalun: [
        "NAME OF MATERIALS",
      ],
      kuwarsi: [
        "NAME OF MATERIALS",
      ]
    };
    const fieldsToCheck = fieldMappings[collection?.toLowerCase?.()] || ["item_name", "name", "Name"];
    const existingField = fieldsToCheck.find(field => item[field] !== undefined);
    if (!existingField) return null;
    const value = item[existingField];
    if (value === null || value === undefined || value === "") return "Unnamed";
    return value;
  };


  useEffect(() => {
    const fetchSpares = async () => {
      setSpares([]);
      if (!projectname || !PROJECTS[projectname]) {
        console.log("No project selected or mapping missing:", projectname, PROJECTS[projectname]);
        return;
      }
      setSparesLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const apiUrl = `${API_URL}/api/${PROJECTS[projectname]}`;
        console.log("Fetching spares from:", apiUrl);
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : undefined,
            "Content-Type": "application/json",
          },
        });
        console.log("Spares response:", response.data);
        const items = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setSpares(items);
      } catch (err) {
        console.log("Error fetching spares:", err);
        setSpares([]);
      } finally {
        setSparesLoading(false);
      }
    };
    fetchSpares();
  }, [projectname]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    // Re-enable submit button on error
    const submitButton = document.querySelector('.submit-btn');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    }
    setIsSubmitting(false);
    }

    if (isSuccess) {
    sendEmailNotification();
      dispatch(reset());
    // Add a small delay before navigation to ensure loading state is shown
    setTimeout(() => {
      navigate("/tickets");
    }, 100);
    }
  // eslint-disable-next-line
  }, [dispatch, isError, isSuccess, navigate, message]);

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (
      !projectname ||
      !sitelocation ||
      !projectlocation ||
      !fault ||
      !issue ||
      !description ||
      !date ||
      !spare ||
      !rating
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!spareQuantity || isNaN(spareQuantity) || parseInt(spareQuantity) < 1) {
      toast.error("Please enter a valid spare quantity (minimum 1)");
      return;
    }
    // Check if requested quantity exceeds available stock
    const spareObj = spares.find(item => item._id === spare);
    const availableCount = spareObj && typeof spareObj.spareCount === 'string' ? parseInt(spareObj.spareCount) : spareObj?.spareCount;
    if (spareObj && availableCount !== undefined && parseInt(spareQuantity) > availableCount) {
      toast.error(`Requested quantity exceeds available stock (${availableCount}).`);
      return;
    }

    // Disable submit button to prevent double submission
    const submitButton = e.target.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("projectname", projectname);
    formData.append("sitelocation", sitelocation);
    formData.append("projectlocation", projectlocation);
    formData.append("fault", fault);
    formData.append("issue", issue);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("spare", spare);
    formData.append("rating", rating);
    formData.append("spareQuantity", spareQuantity);
  
    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(createTicket(formData));
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <BackButton url="/home" />
      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Fill the details</p>
      </section>

      <form onSubmit={onSubmit}>
       
        <section className="form">
          <div className="form-group">
            <label htmlFor="projectname">Project Name</label>
            <select
                name="projectname"
                id="projectname"
                value={projectname}
                onChange={(e) => setprojectname(e.target.value)}
              >
                <option value="" disabled>
                  Select from the options below
                </option>
                <option value="Shong">Shong</option>
                <option value="Solding">Solding</option>
                <option value="Jogini-II">Jogini-II</option>
                <option value="JHP Kuwarsi-II">JHP Kuwarsi</option>
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
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
            <label htmlFor="spare">Spare Needed</label>
            {sparesLoading ? (
              <div>Loading spares...</div>
            ) : projectname && spares.length > 0 ? (
              <>
                <select
                  className="form-control"
                  value={spare}
                  name="Spare Needed"
                  id="spare"
                  onChange={(e) => setspare(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="" disabled>
                    Select a spare
                  </option>
                  {spares.map((item) => {
                    const name = findItemNameField(item, PROJECTS[projectname]);
                    return (
                      <option key={item._id} value={item._id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="spareQuantity" style={{ marginTop: '8px' }}>Spare Quantity</label>
                <input
                  type="number"
                  id="spareQuantity"
                  name="spareQuantity"
                  min="1"
                  value={spareQuantity}
                  onChange={e => setSpareQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                  className="form-control"
                  style={{ width: '100%' }}
                  required
                  placeholder="Enter quantity"
                />
              </>
            ) : (
              <textarea
                className="form-control"
                placeholder="Select a project to see spares"
                value={spare}
                name="Spare Needed"
                id="spare"
                onChange={(e) => setspare(e.target.value)}
                style={{ width: "100%", height: "50px", resize: "none" }}
                disabled
              ></textarea>
            )}
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

        <section className="form">
            <div className="form-group">
              <label htmlFor="images">Upload Photos <span style={{ color: '#999999', fontSize: '12px' }}>(upto 4 images only)</span></label>
              <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files);
                    if (selectedFiles.length > 4) {
                      toast.error("You can only upload up to 4 images");
                      // Clear file input
                      e.target.value = "";
                      return;
                    }
                    setImages(selectedFiles);
                  }}
                />
              </div>
            </section>

        <div className="form-group">
          <button className="btn btn-block submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </>
  );
}

export default NewTicket;

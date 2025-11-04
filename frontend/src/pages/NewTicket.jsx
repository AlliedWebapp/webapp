import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import { saveTicketDraft, updateTicketDraft, deleteTicketDraft } from "../features/drafts/draftsSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import axios from "axios";
import { useRef } from "react";

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
  const { tickets: ticketDrafts } = useSelector((state) => state.drafts);

  const [searchParams] = useSearchParams();
  const [draftId, setDraftId] = useState(null);

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
  const [consumables, setConsumables] = useState([]);
  const [consumablesLoading, setConsumablesLoading] = useState(false);
  const [consumable, setConsumable] = useState("");
  const [fuel_consumed, setFuelConsumed] = useState("");
  const [total_km_driven, setTotalKmDriven] = useState("");
  const [spareSearch, setSpareSearch] = useState(""); 
  const [spareSearchTimeout, setSpareSearchTimeout] = useState(null); 
  const [spareDropdownOpen, setSpareDropdownOpen] = useState(false); 
  const spareInputRef = useRef(null); 
  const [attachments, setAttachments] = useState([]);


  const dispatch = useDispatch();
  const navigate = useNavigate();
const sendEmailNotification = async () => {
  const formData = new FormData();

  formData.append("_subject", `New ticket created by project: ${projectname}`);

  console.log("=== EMAIL NOTIFICATION DEBUG ===");
  console.log("Spare ID:", spare);
  console.log("Project name:", projectname);
  console.log("Available spares count:", spares.length);
  console.log("All spares:", spares);
  
  const spareObj = spares.find(item => item._id === spare);
  let spareName = 'Unknown Spare';
  
  if (spareObj) {
    console.log("Found spare object:", spareObj);
    console.log("Spare object keys:", Object.keys(spareObj));
    // Use the same collection name as in the dropdown
    const collectionName = PROJECTS[projectname];
    spareName = findItemNameField(spareObj, collectionName);
    console.log("Collection name:", collectionName);
    console.log("Extracted spare name:", spareName);
  } else {
    console.log("Spare object not found for ID:", spare);
    console.log("Available spare IDs:", spares.map(s => s._id));
    const collectionName = PROJECTS[projectname];
    console.log("Available spares with names:", spares.map(s => ({ 
      id: s._id, 
      name: findItemNameField(s, collectionName),
      keys: Object.keys(s)
    })));
  }
  
  console.log("Final spare name for email:", spareName);
  console.log("=== END EMAIL DEBUG ===");

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
    await fetch("https://formsubmit.co/shaivyaabby@gmail.com", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
  } catch (error) {
   
  }
};


  const findItemNameField = (item, collection) => {
    // Based on the actual model schemas, here are the correct field names:
    const fieldMappings = {
      jogini: [
        "Spare Discription",  
        "Spare Description",
        "Description"
      ],
      shong: [
        "Description of Material",  
        "Description"
      ],
      solding: [
        "Description of Material", 
        "Description"
      ],
      sdllpsalun: [
        "NAME OF MATERIALS",  
        "Name of Materials"
      ],
      kuwarsi: [
        "NAME OF MATERIALS",
        "Name of Materials"
      ]
    };
    
    const fieldsToCheck = fieldMappings[collection?.toLowerCase?.()] || ["Description", "name", "Name"];
    
    console.log("Looking for spare name in collection:", collection);
    console.log("Available fields in item:", Object.keys(item));
    console.log("Fields to check:", fieldsToCheck);
    
    // First try exact field matches
    let existingField = fieldsToCheck.find(field => 
      item[field] !== undefined && 
      item[field] !== null && 
      item[field] !== "" && 
      item[field] !== "null"
    );
    
    if (existingField) {
      const value = item[existingField];
      console.log("Found exact field match:", existingField, "with value:", value);
      return value || "Unnamed";
    }
    
    // If no exact match, try case-insensitive search
    const itemKeys = Object.keys(item);
    for (const field of fieldsToCheck) {
      const matchingKey = itemKeys.find(key => 
        key.toLowerCase() === field.toLowerCase() && 
        item[key] !== undefined && 
        item[key] !== null && 
        item[key] !== "" && 
        item[key] !== "null"
      );
      if (matchingKey) {
        const value = item[matchingKey];
        console.log("Found case-insensitive match:", matchingKey, "with value:", value);
        return value || "Unnamed";
      }
    }
    
    // Fallback: look for any field that might contain a name/description
    const nameFields = itemKeys.filter(key => 
      (key.toLowerCase().includes('name') || 
       key.toLowerCase().includes('description') || 
       key.toLowerCase().includes('material') ||
       key.toLowerCase().includes('discription')) &&
      item[key] !== undefined && 
      item[key] !== null && 
      item[key] !== "" && 
      item[key] !== "null"
    );
    
    if (nameFields.length > 0) {
      const value = item[nameFields[0]];
      console.log("Found fallback field:", nameFields[0], "with value:", value);
      return value || "Unnamed";
    }
    
    console.log("No suitable field found, returning 'Unnamed'");
    console.log("Item object:", item);
    return "Unnamed";
  };


  useEffect(() => {
    if (!projectname || !PROJECTS[projectname]) {
      setSpares([]);
      return;
    }
    if (!spareSearch) {
      setSpares([]);
      return;
    }
    setSparesLoading(true);

    // Debounce logic
    if (spareSearchTimeout) clearTimeout(spareSearchTimeout);
    const timeout = setTimeout(async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const apiUrl = `${API_URL}/api/${PROJECTS[projectname]}/search?query=${encodeURIComponent(spareSearch)}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : undefined,
            "Content-Type": "application/json",
          },
        });
        setSpares(Array.isArray(response.data) ? response.data : response.data.data || []);
      } catch (err) {
        setSpares([]);
      } finally {
        setSparesLoading(false);
      }
    }, 400); 

    setSpareSearchTimeout(timeout);

    // Cleanup
    return () => clearTimeout(timeout);
  }, [projectname, spareSearch]);

  useEffect(() => {
    const fetchConsumables = async () => {
      setConsumables([]);
      setConsumablesLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const apiUrl = `${API_URL}/api/consumables`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : undefined,
            "Content-Type": "application/json",
          },
        });
        setConsumables(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setConsumables([]);
      } finally {
        setConsumablesLoading(false);
      }
    };
    fetchConsumables();
  }, []);

  useEffect(() => {
    const draftIdParam = searchParams.get("draftId");
    if (draftIdParam) {
      const draft = ticketDrafts.find((d) => d.id === parseInt(draftIdParam));
      if (draft) {
        setDraftId(draft.id);
        setprojectname(draft.projectname || "");
        setsitelocation(draft.sitelocation || "");
        setprojectlocation(draft.projectlocation || "");
        setfault(draft.fault || "");
        setissue(draft.issue || "");
        setdescription(draft.description || "");
        setdate(draft.date || "");
        setspare(draft.spare || "");
        setrating(draft.rating || "");
        setImages(draft.images || []);
        setSpareQuantity(draft.spareQuantity || 1);
        setConsumable(draft.consumable || "");
        setFuelConsumed(draft.fuel_consumed || "");
        setTotalKmDriven(draft.total_km_driven || "");
        setSpareSearch(draft.spareSearch || "");
        setAttachments(draft.attachments || []);

      }
    }
  }, [searchParams, ticketDrafts]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
  
    const submitButton = document.querySelector('.submit-btn');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    }
    setIsSubmitting(false);
    }

    if (isSuccess) {
      if (draftId) {
        dispatch(deleteTicketDraft({ id: draftId }));
        toast.success("Draft submitted and removed successfully!");
      } else {
        toast.success("Ticket submitted successfully!");
      }
      sendEmailNotification();
      dispatch(reset());
 
    setTimeout(() => {
      navigate("/tickets");
    }, 100);
    }

  }, [dispatch, isError, isSuccess, navigate, message]);

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Check mandatory fields only
    if (
      !projectname ||
      !sitelocation ||
      !projectlocation ||
      !fault ||
      !issue ||
      !description ||
      !date
    ) {
      toast.error("Please fill in all mandatory fields: Project Name, Site Location, Project Location, Fault, Issue, Description, and Date");
      return;
    }

    // Optional validation for spare quantity if provided
    if (spareQuantity && (isNaN(spareQuantity) || parseInt(spareQuantity) < 1)) {
      toast.error("Please enter a valid spare quantity (minimum 1)");
      return;
    }

    // Optional validation for spare availability if spare is selected
    if (spare && spareQuantity) {
      const spareObj = spares.find(item => item._id === spare);
      const availableCount = spareObj && typeof spareObj.spareCount === 'string' ? parseInt(spareObj.spareCount) : spareObj?.spareCount;
      if (spareObj && availableCount !== undefined && parseInt(spareQuantity) > availableCount) {
        toast.error(`Requested quantity exceeds available stock (${availableCount}).`);
        return;
      }
    }

    // Optional validation for fuel consumed if provided
    if (fuel_consumed && (fuel_consumed === "" || isNaN(Number(fuel_consumed)) || Number(fuel_consumed) < 0)) {
      toast.error("Fuel consumed must be a non-negative number.");
      return;
    }

    // Optional validation for total KM driven if provided
    if (total_km_driven && (total_km_driven === "" || isNaN(Number(total_km_driven)) || Number(total_km_driven) < 0)) {
      toast.error("Total KM Driven must be a non-negative number.");
      return;
    }

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
    
    // Append optional fields only if they have values
    if (spare) formData.append("spare", spare);
    if (rating) formData.append("rating", rating);
    if (spareQuantity) formData.append("spareQuantity", spareQuantity);
    if (fuel_consumed) formData.append("fuel_consumed", fuel_consumed);
    if (total_km_driven) formData.append("total_km_driven", total_km_driven);
    if (consumable) formData.append("consumable", consumable);
  
    // Append all files (server enforces size limits). Images go under 'images', others under 'attachments'
    (images || []).forEach((image) => formData.append("images", image));
    (attachments || []).forEach((file) => formData.append("attachments", file));

    dispatch(createTicket(formData));
  };

  const handleSaveDraft = () => {
    const draft = {
      id: draftId || Date.now(),
      projectname,
      sitelocation,
      projectlocation,
      fault,
      issue,
      description,
      date,
      spare,
      rating,
      images,
      attachments,
      spareQuantity,
      consumable,
      fuel_consumed,
      total_km_driven,
      spareSearch,
    };
    console.log("Saving ticket draft:", draft);

    if (draftId) {
      dispatch(updateTicketDraft(draft));
      toast.success("Draft updated successfully");
    } else {
      dispatch(saveTicketDraft(draft));
      toast.success("Ticket saved as draft");
    }
    navigate("/drafts");
  };
  // ---------------- REMOVE FILE HANDLERS ----------------
const removeImage = (index) => {
  setImages((prev) => prev.filter((_, i) => i !== index));
};

const removeAttachment = (index) => {
  setAttachments((prev) => prev.filter((_, i) => i !== index));
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
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search for a spare..."
                value={spareSearch}
                onChange={e => {
                  setSpareSearch(e.target.value);
                  setSpareDropdownOpen(true);
                }}
                onFocus={() => setSpareDropdownOpen(true)}
                ref={spareInputRef}
                style={{ width: '100%' }}
                disabled={!projectname}
                autoComplete="off"
              />
              {spareDropdownOpen && projectname && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: "#fff",
                    border: "1px solid #ccc",
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                  }}
                >
                  {sparesLoading ? (
                    <div style={{ padding: "8px 12px", color: "#888" }}>Loading spares...</div>
                  ) : spares.length > 0 ? (
                    spares.map(item => {
                      const name = findItemNameField(item, PROJECTS[projectname]);
                      return (
                        <div
                          key={item._id}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            background: spare === item._id ? "#f0f0f0" : "#fff"
                          }}
                          onMouseDown={() => {
                            setspare(item._id);
                            setSpareSearch(name);
                            setSpareDropdownOpen(false);
                          }}
                        >
                          {name}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: "8px 12px", color: "#888" }}>No spares found.</div>
                  )}
                </div>
              )}
            </div>
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
              placeholder="Enter quantity"
            />
          </div>
        </section>

        <section className="form">
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
            <label htmlFor="consumable">Consumable Required</label>
            {consumablesLoading ? (
              <div>Loading consumables...</div>
            ) : consumables.length > 0 ? (
              <>
                <select
                  className="form-control"
                  value={consumable}
                  name="Consumable Required"
                  id="consumable"
                  onChange={(e) => setConsumable(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="" disabled>
                    Select a consumable
                  </option>
                  {consumables.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="fuel_consumed" style={{ marginTop: '8px' }}>Fuel Consumed</label>
                <input
                  type="number"
                  id="fuel_consumed"
                  name="fuel_consumed"
                  min="0"
                  value={fuel_consumed}
                  onChange={e => setFuelConsumed(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="form-control"
                  style={{ width: '100%' }}
                  placeholder="Enter fuel consumed"
                />
                <label htmlFor="total_km_driven" style={{ marginTop: '8px' }}>Total KM Driven</label>
                <input
                  type="number"
                  id="total_km_driven"
                  name="total_km_driven"
                  min="0"
                  value={total_km_driven}
                  onChange={e => setTotalKmDriven(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="form-control"
                  style={{ width: '100%' }}
                  placeholder="Enter total km driven"
                />
              </>
            ) : (
              <textarea
                className="form-control"
                placeholder="No consumables available"
                value=""
                disabled
                style={{ width: "100%", height: "50px", resize: "none" }}
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
    <label htmlFor="images">
      Upload Photos{" "}
      <span style={{ color: "#999999", fontSize: "12px" }}>
        (up to 4 images)
      </span>
    </label>
    <input
      type="file"
      id="images"
      accept="image/*"
      multiple
      onChange={(e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 4) {
          toast.error("You can only upload up to 4 images");
          e.target.value = "";
          return;
        }
        setImages(selectedFiles);
      }}
    />
    {images.length > 0 && (
      <ul style={{ marginTop: "10px", fontSize: "14px" }}>
        {images.map((file, index) => (
          <li
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            🖼️ {file.name}
            <button
              type="button"
              onClick={() => removeImage(index)}
              style={{
                border: "none",
                background: "transparent",
                color: "red",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</section>

            <section className="form">
  <div className="form-group">
    <label htmlFor="attachments">
      Upload Attachments{" "}
      <span style={{ color: "#999999", fontSize: "12px" }}>
        (Supports any file type)
      </span>
    </label>
    <input
      type="file"
      id="attachments"
      multiple
      onChange={(e) => {
        const selectedFiles = Array.from(e.target.files);
        const tooLarge = selectedFiles.some(
          (f) => f.size > 10 * 1024 * 1024
        );
        if (tooLarge) {
          toast.error("Each file must be under 10 MB");
          e.target.value = "";
          return;
        }
        setAttachments((prev) => [...prev, ...selectedFiles]);
      }}
    />
    {attachments.length > 0 && (
      <ul style={{ marginTop: "10px", fontSize: "14px" }}>
        {attachments.map((file, index) => (
          <li
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            📎 {file.name}
            <button
              type="button"
              onClick={() => removeAttachment(index)}
              style={{
                border: "none",
                background: "transparent",
                color: "red",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</section>


        <div className="form-group">
          <button type="submit" className="btn btn-block submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" className="btn btn-block" onClick={handleSaveDraft}>
            Save as Draft
          </button>
        </div>
      </form>
    </>
  );
}

export default NewTicket;
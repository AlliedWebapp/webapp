import React, { useState, useEffect } from "react";

// Map of your projects, their API‐paths, and which columns they use
const PROJECTS = {
  jogini: {
    label: "Jogini",
    columns: [
      { key: "spareDescription", label: "Spare Description" },
      { key: "make.vendor",       label: "Vendor" },
      { key: "month",             label: "Month" },
      { key: "openingStock",      label: "Opening Stock" },
      { key: "receivedQty",       label: "Received Qty" },
      { key: "monthlyConsumption",label: "Monthly Consumption" },
      { key: "closingStock",      label: "Closing Stock" },
      { key: "spareCount",        label: "Spare Count" },
    ],
  },
  shong: {
    label: "Shong",
    columns: [
      { key: "descriptionOfMaterial", label: "Description" },
      { key: "make",       label: "Make" },
      { key: "vendor",     label: "Vendor" },
      { key: "code.specification", label: "Specification" },
      { key: "place",      label: "Place" },
      { key: "rate",       label: "Rate" },
      { key: "inStock",    label: "In Stock" },
      { key: "spareCount", label: "SpareCount" },
    ],
  },
  solding: {
    label: "Solding",
    columns: [
      { key: "descriptionOfMaterial", label: "Description" },
      { key: "make",       label: "Make" },
      { key: "vendor",     label: "Vendor" },
      { key: "code.specification", label: "Specification" },
      { key: "place",      label: "Place" },
      { key: "rate",       label: "Rate" },
      { key: "inStock",    label: "In Stock" },
      { key: "spareCount", label: "SpareCount" },
    ],
  },
  sdllpsalun: {
    label: "SDLLP Salun",
    columns: [
      { key: "nameOfMaterials",     label: "Name" },
      { key: "openingBalance",      label: "Opening Bal." },
      { key: "receivedDuringMonth", label: "Received" },
      { key: "total[0]",            label: "Total[0]" },
      { key: "total[1]",            label: "Total[1]" },
      { key: "issueDuringMonth",    label: "Iss. Month" },
      { key: "issueDuringYear",     label: "Iss. Year" },
      { key: "closingBalance",      label: "Closing Bal." },
      { key: "make.manufacture",    label: "Manufacture" },
      { key: "spareCount",          label: "SpareCount" },
    ],
  },
  kuwarsi: {
    label: "Kuwarsi",
    columns: [
      { key: "nameOfMaterials",     label: "Name" },
      { key: "openingBalance",      label: "Opening Bal." },
      { key: "receivedDuringMonth", label: "Received" },
      { key: "total[0]",            label: "Total[0]" },
      { key: "total[1]",            label: "Total[1]" },
      { key: "issueDuringMonth",    label: "Iss. Month" },
      { key: "issueDuringYear",     label: "Iss. Year" },
      { key: "closingBalance",      label: "Closing Bal." },
      { key: "make.manufacture",    label: "Manufacture" },
      { key: "remarks",             label: "Remarks" },
      { key: "spareCount",          label: "SpareCount" },
    ],
  },
};

export default function InventoryManager() {
  const [projectKey, setProjectKey] = useState("shong");
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState({ mode: null, data: {}, id: null });

  // Fetch whenever project changes
  useEffect(() => {
    fetch(`/api/inventory/${projectKey}`)
      .then((r) => r.json())
      .then(setItems);
  }, [projectKey]);

  function openAdd() {
    setModal({ mode: "add", data: {}, id: null });
  }
  function openEdit(item) {
    setModal({ mode: "edit", data: item, id: item._id });
  }
  function closeModal() {
    setModal({ mode: null, data: {}, id: null });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    // support nested like "code.specification" or array indexes
    const keys = name.split(/[\.\[\]]/).filter(Boolean);
    setModal((m) => {
      let d = { ...m.data };
      let cur = d;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = cur[keys[i]] || {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return { ...m, data: d };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url =
      modal.mode === "add"
        ? `/api/inventory/${projectKey}`
        : `/api/inventory/${projectKey}/${modal.id}`;

    const payload =
      modal.mode === "edit"
        ? { ...modal.data, code: { specification: "A11IED" } }
        : modal.data;

    await fetch(url, {
      method: modal.mode === "add" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    closeModal();
    // refresh
    const fresh = await fetch(`/api/inventory/${projectKey}`).then((r) => r.json());
    setItems(fresh);
  }

  const cfg = PROJECTS[projectKey];

  return (
    <div style={{ padding: 20 }}>
      <h1>View Inventory</h1>
      <div>
        Select Project:{" "}
        <select
          value={projectKey}
          onChange={(e) => setProjectKey(e.target.value)}
        >
          {Object.entries(PROJECTS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        &nbsp;
        <button onClick={openAdd}>Add New Item</button>
      </div>

      <h2>{cfg.label} Project</h2>
      <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            {cfg.columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id}>
              {cfg.columns.map((c) => {
                const val = c.key
                  .split(/[\.\[\]]/)
                  .filter(Boolean)
                  .reduce((o, k) => (o ? o[k] : ""), it);
                return <td key={c.key}>{val ?? ""}</td>;
              })}
              <td>
                <button onClick={() => openEdit(it)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal.mode && (
        <div
          style={{
            position: "fixed",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <h3>{modal.mode === "add" ? "Add New" : "Edit"} {cfg.label}</h3>
          <form onSubmit={handleSubmit}>
            {cfg.columns.map((c) => {
              // skip nested code.specification on add
              if (modal.mode === "add" && c.key.startsWith("code")) return null;
              // input name = key
              let value = modal.data;
              c.key
                .split(/[\.\[\]]/)
                .filter(Boolean)
                .forEach((k) => (value = value ? value[k] : ""));
              return (
                <div key={c.key} style={{ marginBottom: 8 }}>
                  <label style={{ minWidth: 140, display: "inline-block" }}>
                    {c.label}:
                  </label>
                  <input
                    name={c.key}
                    value={value ?? ""}
                    onChange={handleChange}
                  />
                </div>
              );
            })}

            {modal.mode === "edit" && (
              <div style={{ marginBottom: 8 }}>
                <label style={{ minWidth: 140, display: "inline-block" }}>
                  Code (forced):
                </label>
                <input value="A11IED" readOnly style={{ background: "#eee" }} />
              </div>
            )}

            <button type="submit">
              {modal.mode === "add" ? "Create" : "Update"}
            </button>{" "}
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

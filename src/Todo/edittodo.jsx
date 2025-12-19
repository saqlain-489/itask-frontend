import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

export default function Editpage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // preview for existing or new image
  const [user, setUser] = useState([])

  const navigate = useNavigate();
  const location = useLocation();
  const { todo } = location.state || {};

  if (!todo) {
    navigate("/todo");
    return null;
  }
  useEffect(() => {
    async function fetchCurrentUser() {
      try {

        const token = localStorage.getItem('accesstoken')
        const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/users/me`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        const data = await res.json();
        console.log(data)
        setUser(data)
        console.log(user)

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchCurrentUser();
  }, [])


  // Show existing image initially
  useState(() => {
    if (todo.Picture) setPreview(todo.Picture);
  }, [todo.Picture]);

  // const formatForDateTimeLocal = (date) => {
  //   if (!date) return "";
  //   try {
  //     let jsDate;
  //     if (date?.toDate) jsDate = date.toDate();
  //     else if (date?.seconds) jsDate = new Date(date.seconds * 1000);
  //     else jsDate = new Date(date);
  //     return isNaN(jsDate.getTime()) ? "" : jsDate.toISOString().slice(0, 16);
  //   } catch {
  //     return "";
  //   }
  // };
  const formatForDateTimeLocal = (date) => {
    if (!date) return "";
    try {
      const jsDate = new Date(date);
      return isNaN(jsDate.getTime()) ? "" : jsDate.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      Title: todo?.Title || "",
      Description: todo?.Description || "",
      Location: todo?.Location || "",
      Address: todo?.Address || "",
      DateTime: formatForDateTimeLocal(todo?.DateTime),
      Level: todo?.Level || "",
    },
    validationSchema: Yup.object({
      Title: Yup.string().min(2).max(50).required("Title is required"),
      Description: Yup.string().required("Description is required"),
      Level: Yup.string().required("Priority Level is required"),
    }),

    onSubmit: async (values) => {
      try {
        let imageUrl = todo.Picture || null;

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "unsigned_preset");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dhldjoqou/image/upload",
            { method: "POST", body: formData }
          );

          const data = await res.json();
          if (!data.secure_url) throw new Error("Upload failed");
          imageUrl = data.secure_url;
        }

        // Convert DateTime
        // let dateTimeValue = null;
        // if (values.DateTime?.trim()) {
        //   const date = new Date(values.DateTime);
        //   if (!isNaN(date.getTime())) dateTimeValue = date.toISOString();
        // }

        // const user = auth.currentUser;
        // let todoRef;

        // if (todo.path) {
        //   todoRef = doc(db, todo.path);
        // } else if (user?.uid) {
        //   todoRef = doc(db, "todo", user.uid, "tasks", todo.id);
        // } else {
        //   throw new Error("No valid path or user ID");
        // }

        // await updateDoc(todoRef, {
        //   Title: values.Title,
        //   Description: values.Description,
        //   Location: values.Location,
        //   Address: values.Address,
        //   DateTime: values.DateTime,
        //   Level: values.Level,
        //   checked: todo.checked || false,
        //   updatedAt: new Date().toISOString(),
        //   Picture: imageUrl,
        // });
        const token = localStorage.getItem("accesstoken")
        const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/todos/${todo._id}`,
          {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Title: values.Title,
              Description: values.Description,
              Location: values.Location,
              Address: values.Address,
              DateTime: values.DateTime,
              Level: values.Level,
              checked: todo.checked || false,
              Picture: imageUrl,
            })
          }
        )
        if (!res.ok) {
          const err = await res.text();
          console.error("Server error:", err);
          return;
        }
        const data = await res.json();
        console.log(data)

        if (user.role === 'user' ? navigate("/Todos") : navigate("/Admin-Todos"))

          setShowSuccess(true);

      } catch (err) {
        console.error(err);
        alert("Error updating todo: " + err.message);
      }
    },
  });

  return (
    <div className="inputcontainer">
      <form className="todoinput" onSubmit={formik.handleSubmit}>
        <div className="d-flex gap-2">
          <h2>Edit To-do</h2>
          <h2><i className="bi bi-card-checklist"></i></h2>
        </div>

        {/* ===== Title ===== */}
        <label htmlFor="Title">Title:</label>
        <input
          type="text"
          name="Title"
          id="Title"
          value={formik.values.Title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
          placeholder="Type..."
        />
        {formik.touched.Title && formik.errors.Title && (
          <div className="text-danger small">{formik.errors.Title}</div>
        )}

        {/* ===== Description ===== */}
        <label htmlFor="Description">Description:</label>
        <input
          type="text"
          name="Description"
          id="Description"
          value={formik.values.Description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
          placeholder="Type..."
        />
        {formik.touched.Description && formik.errors.Description && (
          <div className="text-danger small">{formik.errors.Description}</div>
        )}

        {/* ===== Location & Address ===== */}
        <label htmlFor="Location">Location:</label>
        <input
          type="text"
          name="Location"
          id="Location"
          value={formik.values.Location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
          placeholder="Type..."
        />

        <label htmlFor="Address">Address:</label>
        <input
          type="text"
          name="Address"
          id="Address"
          value={formik.values.Address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
          placeholder="Type..."
        />

        {/* ===== Date ===== */}
        <label htmlFor="DateTime">Date and Time:</label>
        <input
          type="datetime-local"
          name="DateTime"
          id="DateTime"
          value={formik.values.DateTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control datetime"
        />

        {/* ===== Priority ===== */}
        <div className="mt-2">
          <div className="d-inline me-2">Priority Level:</div>
          <div className="d-flex gap-3">
            {["urgent", "imp", "notImp"].map((Level) => (
              <div key={Level}>
                <input
                  type="radio"
                  name="Level"
                  id={Level}
                  value={Level}
                  checked={formik.values.Level === Level}
                  onChange={formik.handleChange}
                />
                <label htmlFor={Level} className="ms-1">
                  {Level === "urgent"
                    ? "Urgent"
                    : Level === "imp"
                      ? "Important"
                      : "Not Important"}
                </label>
              </div>
            ))}
          </div>
          {formik.errors.Level && (
            <div className="text-danger small mt-1">{formik.errors.Level}</div>
          )}
        </div>

        {/* ===== Image Upload with Preview ===== */}
        <label htmlFor="Picture"  >Picture:</label>
        {preview && (
          <div className=" ">
            <img
              src={preview}
              alt="Preview"
              style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
            />
            <p className="small text-muted  ">Current image</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          name="Picture"
          className="form-control p-1"
          onChange={(e) => {
            const selected = e.target.files[0];
            setFile(selected);
            if (selected) setPreview(URL.createObjectURL(selected));
          }}
        />

        {/* ===== Success Message ===== */}
        {showSuccess && (
          <div className="alert alert-success mt-3" role="alert">
            <strong>Success!</strong> Todo has been updated.
          </div>
        )}

        {/* ===== Buttons ===== */}
        <div className="inputbuttons">
          <button
            type="submit"
            className="btn btn-primary text-light mt-3"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Updating..." : "Update To-do"}
          </button>

          <Link to={user.role === 'admin' ? "/Admin-Todos" : "/Todos"}>
            <button
              type="button"
              className="btn btn-secondary text-light mt-3 ms-2"
            >
              {user.role === 'admin' ? 'Back to all todos' : ' Back to To-do List'}
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

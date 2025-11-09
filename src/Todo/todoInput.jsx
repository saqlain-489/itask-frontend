import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db, auth } from "./firebaseConfig";
import { toast } from "react-hot-toast";
import { createTodo } from "../Todo/store/todoslice";
import { useDispatch } from "react-redux";


export default function Inputpage() {
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
const dispatch = useDispatch();

  const navigate = useNavigate();
  const user = auth.currentUser;

  function generateSearchKeywords(text) {
    const words = text.toLowerCase().split(/\s+/)
    const prefixes = []
    words.forEach(word => {
      for (let i = 0; i <= word.length; i++) {
        prefixes.push(word.slice(0, i))
      }
    })
    console.log(prefixes)
    return prefixes;
  }

  const formik = useFormik({
    initialValues: {
      Title: "",
      Description: "",
      Location: "",
      Address: "",
      DateTime: "",
      Level: "",
      Picture: null,
    },

    validationSchema: Yup.object({
      Title: Yup.string().min(2).max(50).required("Title is required"),
      Description: Yup.string().required("Description is required"),
      Level: Yup.string().required("Level is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      // const user = auth.currentUser
      // if (!user) return toast.error("Not logged in");
      // if (user.email == 'j@g.co') return toast.error("Admin cannot store todo");
        console.log({...values})

      try {
        // setUploading(true);
        setIsSending(true);
        let imageUrl = null;


        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "unsigned_preset");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dhldjoqou/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await res.json();
          if (!data.secure_url) throw new Error("Upload failed");
          imageUrl = data.secure_url;
        }
        // dispatch(createTodo({...values,imageUrl}))
        dispatch(createTodo({ values, imageUrl }));

        // const token = localStorage.getItem("token")
        // const res2 = await fetch('http://localhost:3000/api/todos',
        //   {
        //     method: "POST",
        //     body: JSON.stringify({
        //       ...values,
        //       Title: values.Title,
        //       DateTime: values.DateTime,
        //         // ? Timestamp.fromDate(new Date(values.DateTime))
        //         // : null,
        //       checked: false,
        //       // userId: user.uid,
        //       // createdAt: new Date(),
        //       Picture: imageUrl,
        //       // searchKeywords: generateSearchKeywords(values.Title)
        //     }),
        //     headers: {
        //       "Authorization": `Bearer ${token}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // )
        // if (!res2.ok) {
        //   const err = await res2.text();
        //   console.error("Server error:", err);
        //   return;
        // }

        // const data2 = await res2.json();
        // console.log("Todos fetched:", data2);

        // if (!user) {
        //   alert("You must be logged in to add todos!");
        //   return;
        // }

        // const todoCollectionRef = collection(db, "todo", user.uid, "tasks");

        // await addDoc(todoCollectionRef, {
        //   ...values,
        //   Title: values.Title,
        //   DateTime: values.DateTime
        //     ? Timestamp.fromDate(new Date(values.DateTime))
        //     : null,
        //   checked: false,
        //   userId: user.uid,
        //   createdAt: new Date(),
        //   picture: imageUrl,
        //   searchKeywords: generateSearchKeywords(values.Title),
        // });

        // resetForm();
        // setIsSending(false);
        // setUploading(false);
        navigate("/Todos");
        toast.success("Todo added successfully!");
      } catch (error) {
        console.error("Error adding todo:", error);
        alert("Something went wrong while saving your todo!");
      } finally {
        setIsSending(false);

      }
    },
  });

  return (
    <div className="inputcontainer">

      <form className="todoinput" onSubmit={formik.handleSubmit}>
        <div className="d-flex gap-2">
          <h2>Add To-do</h2>
          <h2><i className="bi bi-card-checklist"></i></h2>
        </div>

        <label htmlFor="Title">Title:</label>
        <input
          type="text"
          name="Title"
          value={formik.values.Title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Type..."
          className="form-control"
        />
        {formik.touched.Title && formik.errors.Title && (
          <div className="text-danger small">{formik.errors.Title}</div>
        )}


        <label htmlFor="Description">Description:</label>
        <input
          type="text"
          name="Description"
          value={formik.values.Description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Type..."
          className="form-control"
        />
        {formik.touched.Description && formik.errors.Description && (
          <div className="text-danger small">{formik.errors.Description}</div>
        )}

        <label htmlFor="Location">Location:</label>

        <input
          type="text"
          name="Location"
          value={formik.values.Location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Type..."
          className="form-control"
        />

        <label htmlFor="Address">Address:</label>
        <input
          type="text"
          name="Address"
          value={formik.values.Address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Type..."
          className="form-control"
        />


        <label htmlFor="DateTime">Date and Time:</label>
        <input
          type="datetime-local"
          name="DateTime"
          value={formik.values.DateTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control datetime"
        />

        <div className="d-inline me-2">Sort by:</div>
        <div className="d-flex">
          <input
            type="radio"
            name="Level"
            id="urgent"
            value="urgent"
            // checked={order === "newest"}
            onChange={formik.handleChange}
          />
          <label htmlFor="urgent" className="ms-1 me-2">Urgent</label>

          <input
            type="radio"
            name="Level"
            id="important"
            value="imp"
            onChange={formik.handleChange}

          />
          <label htmlFor="important" className="ms-1 me-2">Important</label>

          <input
            type="radio"
            name="Level"
            id="notimp"
            value="notImp"
            onChange={formik.handleChange}
          />
          <label htmlFor="notimp" className="ms-1 me-2">Not imoportant</label>
        </div>
        {formik.touched.Level && formik.errors.Level && (
          <div className="text-danger small">{formik.errors.Level}</div>
        )}
        <label htmlFor="Picture">Add picture:</label>
        {preview && (
          <div className="">
            <img
              src={preview}
              alt="Preview"
              style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
            />
            <p className="small text-muted m-0">Preview</p>
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


        <div className="inputbuttons">
          <button type="submit" className="btn btnadd btn-primary  mt-md-3 mt-1" disabled={isSending}>
            Add To-do
          </button>

          {/* <Link to={(user.email == 'j@g.co') ? '/admin-dashboard' : "/todo"}> */}
          <Link to="/Todos">
            <button
              type="button"
              className="btn btn-secondary mt-md-3 mt-1 ms-md-2 ms-0"
              disabled={isSending}
            >
              {/* {(user.email == 'j@g.co') ? "Back to dashboard" : "Back to To-do List"} */}
              Go back
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

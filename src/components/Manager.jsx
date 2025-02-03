import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ToastContainer, toast } from "react-toastify";

const Manager = () => {
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [formArray, setformArray] = useState([]);
  const ref = useRef();
  const passref = useRef();

  const getpasswords = async () => {
    let req = await fetch("http://localhost:5000/");
    let passwords = await req.json();
    console.log(passwords);
    setformArray(passwords);
  };

  useEffect(() => {
    getpasswords();
  }, []);

  const handleEdit =async (id) => {
    let newArray = formArray.filter((obj) => {
      return obj.id != id;
    });
    setform(
      formArray.find((obj) => {
        return obj.id == id;
      })
    );
    await fetch("http://localhost:5000", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setformArray(newArray);
    console.log(newArray);
    localStorage.setItem("formData", JSON.stringify(newArray));
  };

  const handleDelete = async (id) => {
    let newArray = formArray.filter((obj) => {
      return obj.id != id;
    });

    setformArray(newArray);
    console.log(newArray);
    await fetch("http://localhost:5000", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });

    toast("🦄 Data delete successfully !", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const saveform = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      setformArray([...formArray, { ...form, id: uuidv4() }]);
      await fetch("http://localhost:5000", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, id: uuidv4() }),
      });
      setform({ site: "", username: "", password: "" });
      toast("🦄Data saved successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast("🦄Enter valid Data!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast("🦄 copied to clipboard!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showPassword = () => {
    console.log(ref.current.src);
    if (ref.current.src.includes("src/assets/hide.png")) {
      ref.current.src = "src/assets/view.png";
      passref.current.type = "text";
    } else {
      ref.current.src = "src/assets/hide.png";
      passref.current.type = "password";
    }
  };
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container">
        <h1 className="logo">
          Pass<span>OP</span>
        </h1>
        <h3>Your own password Manager</h3>
        <input
          name="site"
          onChange={handleChange}
          value={form.site}
          className="Input"
          type="text"
          placeholder="Enter website url"
          required
        />
        <input
          name="username"
          onChange={handleChange}
          value={form.username}
          className="Input"
          type="text"
          placeholder="Enter username"
          required
        />
        <div className="relative">
          <input
            name="password"
            onChange={handleChange}
            value={form.password}
            ref={passref}
            type="password"
            id=""
            required
            placeholder="Enter Password"
          />
          <span onClick={showPassword}>
            <img ref={ref} src="src/assets/hide.png" alt="" />
          </span>
        </div>
        <button onClick={saveform}>
          <img
            className="submit-icon"
            src="src/assets/arrow-right.png"
            alt=""
          />
          Submit Data
        </button>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Site</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formArray.map((item) => (
                <tr key={item.id}>
                  <td>
                   <span>{item.site}{" "}</span>
                    <span>
                      <img
                        onClick={() => {
                          return copyText(item.site);
                        }}
                        className="copy"
                        src="src/assets/copy.png"
                        alt=""
                      />
                    </span>
                  </td>
                  <td>
                    <span>{item.username}{" "}</span>
                    <span>
                      <img
                        onClick={() => {
                          return copyText(item.username);
                        }}
                        className="copy"
                        src="src/assets/copy.png"
                        alt=""
                      />
                    </span>
                  </td>
                  <td>
                    <span>{item.password}{" "}</span>
                    <span>
                      <img
                        onClick={() => {
                          return copyText(item.password);
                        }}
                        className="copy"
                        src="src/assets/copy.png"
                        alt=""
                      />
                    </span>
                  </td>
                  <td>
                    <div className="edit-delete-div">
                      <img
                        onClick={() => {
                          return handleEdit(item.id);
                        }}
                        className="edit-delete"
                        src="src/assets/edit.png"
                      />
                      <img
                        onClick={() => {
                          return handleDelete(item.id);
                        }}
                        className="edit-delete"
                        src="src/assets/delete.png"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Manager;

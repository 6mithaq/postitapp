import { Container, Row, Col, Button } from "reactstrap";

import { userSchemaValidation } from "../Validations/UserValidations";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useSelector, useDispatch } from "react-redux";

import { useState } from "react";

import {
  addUser,
  deleteUser,
  updateUser,
  registerUser,
} from "../Features/UserSlice";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const userList = useSelector((state) => state.users.value);

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation), //Associate your Yup validation schema using the resolver
  });

  const dispatch = useDispatch();
  const navigate = useNavigate(); //declares a constant variable named navigate and assigns it the value returned by the useNavigate() hook.

  // Handle form submission
  const onSubmit = (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      console.log("Form Data", data); // You can handle the form submission here
      alert("Validation all good.");
      //dispatch(addUser(userData)); //use the useDispatch hook to dispatch an action, passing as parameter the userData
      dispatch(registerUser(userData)); // Dispatch an action to add a new user by passing the user data to the Redux store
      navigate("/login"); //redirect to login component
    } catch (error) {
      console.log("Error.");
    }
  };

  const handleDelete = (email) => {
    dispatch(deleteUser(email));
  };

  const handleUpdate = (email) => {
    const userData = {
      name: name, //create an object with the values from the state variables
      email: email,
      password: password,
    };
    dispatch(updateUser(userData)); //use the useDispatch hook to dispatch an action, passing as parameter the userData
  };

  return (
    <Container fluid>
      <Row className="formrow">
        <Col className="columndiv1" lg="6">
          <form className="div-form" onSubmit={handleSubmit(onSubmit)}>
            <section className="form">
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter your name..."
                  {...register("name", {
                    onChange: (e) => setname(e.target.value),
                  })}
                />
                <p className="error">{errors.name?.message}</p>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email..."
                  {...register("email", {
                    onChange: (e) => setemail(e.target.value),
                  })}
                />
                <p className="error">{errors.email?.message}</p>
              </div>

              {/* ------------------------------------------------------------------------
              <div className="form-group">
                <input
                  type="text"
                  id="age1"
                  className="form-control"
                  placeholder="Enter your age1..."
                  {...register("age1")}
                />
                <p className="error">{errors.age1?.message}</p>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="age2"
                  className="form-control"
                  placeholder="Enter your age2..."
                  {...register("age2")}
                />
                <p className="error">{errors.age2?.message}</p>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="salary"
                  className="form-control"
                  placeholder="Enter your salary..."
                  {...register("salary")}
                />
                <p className="error">{errors.salary?.message}</p>
              </div>

    ------------------------------------------------------------------------*/}

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password..."
                  {...register("password", {
                    onChange: (e) => setpassword(e.target.value),
                  })}
                />
                <p className="error">{errors.password?.message}</p>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your password..."
                  {...register("confirmPassword", {
                    onChange: (e) => setconfirmPassword(e.target.value),
                  })}
                />
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>
              <Button color="primary" className="button">
                Register
              </Button>
            </section>
          </form>
        </Col>

        <Col className="columndiv1" lg="6"></Col>
      </Row>

      <Row>
        <Col md={6}>
          {/* 
          List of Users
          <table>
            <tbody>
              {userList.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>
                    <Button onClick={() => handleDelete(user.email)}>
                      Delete User
                    </Button>

                    <Button onClick={() => handleUpdate(user.email)}>
                      Update User
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          */}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

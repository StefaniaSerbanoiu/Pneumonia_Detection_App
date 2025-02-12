import React, { useState } from 'react';
import './LoginPage.css';
import httpClient_axios from '../../httpClient_axios';


const LoginPage = () => {
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleRegister = async () => {
        try {
            const response = await httpClient_axios.post("//localhost:5000/register", {
                username, 
                email,
                password,
            });

            if (!response.status == 200) {
                throw new Error('Error!!! There was a problem with the response from the backend!');
            }


            const data = await response.data;
            console.log(data); // log response from backend

            window.location.href = '/upload'; // redirect to /upload after successful registration
        } catch (error) {
            if (error.response != undefined && error.response.status === 409) { // check for a conflict http response
                alert("The username or email is already in use!!!"); // show an alert box in case of duplicated username or email
              }
            console.error('Error during register operation :', error);
        }
    };



    const handleLogin = async () => {
        try {
            const response = await httpClient_axios.post("//localhost:5000/login", {
            username,
            password,
            });

            console.log(response)

            if (!response.status == 200) {
                throw new Error('Error!!! There was a problem with the response from the backend!');
            }

            const data = await response.data;
            console.log(data); // log response from backend

            window.location.href = '/upload'; // redirect to /upload after successful registration
            
        } catch (error) {
            if (error.response != undefined && error.response.status === 401) { 
                alert("Error!!! The credentials are not valid!!!"); // show an alert box in case of an incorrect username/password
              }
            console.error('Error while logging in:', error);
        }
    };


    return (
        <div className='container'>
            <div className='header'>
                <div className='text-container'>
                    <div className={`text ${action === 'Login' ? 'active' : 'inactive'}`} onClick={() => setAction("Login")}>Login</div>
                    <div className={`text ${action === 'Register' ? 'active' : 'inactive'}`} onClick={() => setAction("Register")}>Register</div>
                </div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
    
                <div className='input'>
                    <input 
                        type="text" 
                        placeholder={action === "Login" ? "Username or Email" : "Username"} 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {action === "Login" ? null :
                    <div className='input'>
                        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                }

                <div className='input'>
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>

            </div>
            <div className='submit-container'>
                <div className={action === "Register" ? "submit-inactive" : "submit"}
                    onClick={handleLogin}>
                    Login
                </div>

                <div className={action === "Login" ? "submit-inactive" : "submit"}
                    onClick={handleRegister}>
                    Register
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

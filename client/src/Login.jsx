import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {

    const [ userInformation, setUserInformation ] = useState({username: '', password: ''})
    const [ errorMessage, setErrorMessage ]=  useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:3000/login', {
            credentials: 'include',
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            // If contains a valid cookie, redirect to homepage,
            if(data.isAuthenticated){
                navigate('/')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    function handleLogIn() {

        fetch('http://localhost:3000/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInformation)
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if(data.success){
                navigate('/')
            }else{
                setErrorMessage('Username and password do not match')
            }
        }).catch(error => {
            console.log(error)
        })
    }
    return (
        <div className="login-form-body">
            <h1>LOG IN</h1>
            <div className="login-form">
                <span className="error">{errorMessage}</span>
                <div className="input-component">
                    <label htmlFor="username">Username</label>
                    <hr />
                    <input id="username" name="username" type="text" placeholder="username" 
                    value={userInformation.username} onChange={(e) => {setUserInformation({...userInformation, username: e.target.value})}}/>
                </div>
                <div className="input-component">
                    <label htmlFor="password">Password</label>
                    <hr />
                    <input id="password" name="password" type="password" placeholder="password" 
                    value={userInformation.password} onChange={(e) => {setUserInformation({...userInformation, password: e.target.value})}}/>
                </div>
                <div className="button-wrapper">
                    <button className="btn-blue form-login-button" onClick={handleLogIn}>Log in</button>
                </div>
             </div>
             <div className="login-form-footer">
                <p>Do not have an account? Click <a href="/register">here</a> to register.</p>
             </div>
        </div>
    )

}
import Header from './components/Header'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {

    const [ newUserInformation, setNewUserInformation ] = useState({fname: '', lname: '', username: '', email: '', password: ''})
    const [ fieldError, setFieldError ] = useState({fname: '', lname: '', username: '', email: '', password: ''})
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

    async function handleRegister() {

        // Send the data to the server
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserInformation)
            })
            
            console.log(`${response.status}`)
            if(response.status == 200){
                navigate('/') // Redirect to the homepage once the user data is successfully sent to the server
            }else{
                const data = await response.json()
                // Set the error fields with the values received from the server
                console.log(data)
                setFieldError(data)
                throw new Error('Validation failed')
            }

        }catch(err){
            console.log(err.message)
        }
    }
    return (
        <div className="register-form-body">
            <h1>REGISTER AN ACCOUNT</h1>
            <div className="register-form">
                <div className="input-component">
                    <label htmlFor="fname">First Name</label>
                    <span className="fname-error error">{fieldError.fname}</span>
                    <hr />
                    <input id="fname" name="fname" type="text" placeholder="first name" 
                    value={newUserInformation.fname} onChange={(e) => {setNewUserInformation({...newUserInformation, fname: e.target.value})}} />
                </div>
                <div className="input-component">
                    <label htmlFor="lname">Last Name</label>
                    <span className="lname-error error">{fieldError.lname}</span>
                    <hr />
                    <input id="lname" name="lname" type="text" placeholder="last name" 
                    value = {newUserInformation.lname} onChange = {(e) => {setNewUserInformation({...newUserInformation, lname: e.target.value})}}/>
                </div>
                <div className="input-component">
                    <label htmlFor="username">Username</label>
                    <span className="username-error error">{fieldError.username}</span>
                    <hr />
                    <input id="username" name="username" type="text" placeholder="username" 
                    value = {newUserInformation.username} onChange = {(e) => {setNewUserInformation({...newUserInformation, username: e.target.value})}}/>
                </div>
                <div className="input-component">
                    <label htmlFor="email">E-mail</label>
                    <span className="email-error error">{fieldError.email}</span>
                    <hr />
                    <input id="email" name="email" type="text" placeholder="example@company.com" 
                    value = {newUserInformation.email} onChange = {(e) => {setNewUserInformation({...newUserInformation, email: e.target.value})}}/>
                </div>
                <div className="input-component">
                    <label htmlFor="password">Password</label>
                    <span className="password-error error">{fieldError.password}</span>
                    <hr />
                    <input id="password" name ="password" type="password" placeholder="password" 
                    value = {newUserInformation.password} onChange={(e) => {setNewUserInformation({...newUserInformation, password: e.target.value})}}/>
                </div>
                <div className="button-wrapper">
                    <button className="btn-blue form-register-button" onClick={handleRegister}>Register</button>
                </div>
            </div>
            <div className="register-footer">
                <p>Already have an account? Click <a href="/login">here</a> to log in to your account.</p>
            </div>
        </div>
    )
    
}
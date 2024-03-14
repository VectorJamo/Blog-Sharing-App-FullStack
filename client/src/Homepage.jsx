import Header from './components/Header'
import Footer from './components/Footer'
import {useState, useEffect} from 'react'

export default function Homepage(){

    // TODO: Check if the user has a token or not
    // If the user does not have a token, change the header as needed and display the content that says 'Log in to get started'
    // If the user does have a token display the blogs in the homepage
    const [username, setUsername] = useState(null)

    useEffect(() => {
        // TODO: Fetch the status of the user, either logged in or not
        fetch('http://localhost:3000/', {
            credentials: 'include'
        })
        .then(response => {
            return response.json()
        }).then(data => {
            setUsername(data.username)
        }).catch(error => {
            console.log(error)
        })
            
        // If user is logged in (verified from the backend), then set the username variable to the name of the user

    }, [])
    
    return (
        <div className="homepage-body">
            <Header isAtHomepage={true} currentUser={username}/>

            <div className="homepage-content content">
                <p>
                    Welcome to the blog sharing application made by Suraj Neupane. This website features user authentication, server-side validation, 
                    database management and and overall display of skills of both frontend and backend. 
                </p>
            </div>

            <Footer />
        </div>
    )
}
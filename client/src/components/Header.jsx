import { useNavigate } from "react-router-dom"

export default function Header({currentUser = null, isAtHomepage = true}){
    const navigate = useNavigate()

    function handleRegister() {

        // TODO: Navigate to the register page
        navigate('/register')
    }
    function handleLogIn(){

        // TODO: Navigate to the log in page
        navigate('/login')
    }
    function handleShowBlogs() {
        
        // TODO: Check if authenticated
        navigate('/blogs')
    }

    function handleShowHomepage() {
        navigate('/')
    }
    function handleLogOut() {
        
        // TODO: Send a request to the server to log out and navigate to the log in page
        fetch('http://localhost:3000/logout', {
            credentials: 'include'
        })
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            console.log(error)

        })
    }
    return (
        <>
            <div className="flx-row-sb-c header">
                <div className="header-left">
                    <h1>Share Blogs</h1>
                </div>
                <div className="header-right">
                    {currentUser != null ? 
                    <>
                        <span>Current user: {currentUser}</span>
                        {isAtHomepage ? 
                        <button className="btn-red blogs-button" onClick={handleShowBlogs}>Blogs</button> :
                        <button className="btn-red blogs-button" onClick={handleShowHomepage}>Homepage</button> 
                        } 
                        <button className="btn-blue logout-button" onClick={handleLogOut}>Log out</button> 
                    </>
                    : 
                    <>
                        <button className="btn-blue login-button" onClick={handleLogIn}>Log in</button>
                        <button className="btn-blue register-button" onClick={handleRegister}>Register</button>
                    </>}
                </div>
            </div>
            <hr/>
        </>
    )

}
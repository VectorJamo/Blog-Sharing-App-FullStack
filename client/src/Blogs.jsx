import Header from "./components/Header"
import Footer from "./components/Footer"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Blogs() {

    const [username, setUsername] = useState('XXX')
    const [allBlogs, setAllBlogs] = useState(new Array())

    const [blogTitle, setBlogTitle] = useState('')
    const [blogBody, setBlogBody] = useState('')
    const [blogError, setBlogError] = useState({title: ' ', body: ' '})

    const [isCreateBlogOpen, setIsCreateBlogOpen] = useState(false)
    const [isViewBlogOpen, setIsViewBlogOpen] = useState({isOpen: false, title: '', body: '', user: '', blogID: '', comments: []})

    const [commentText, setCommentText] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        // TODO: Check for authentication and get all the blogs
        fetch('http://localhost:3000/blogs', {
            credentials: 'include'
        })
        .then(response => {
            return response.json()
        }).then(data => {
            if(data.username == null){
                navigate('/')
            }else{
                setUsername(data.username)
                // Fetch for the blogs
                fetch('http://localhost:3000/allblogs', {
                    credentials: 'include'
                })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    setAllBlogs(data)
                    console.log(data)
                })
                .catch(error => {
                    console.log(error)
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }, [])

    function handleBlogSend() {

        // Send the title and body to the database
        fetch('http://localhost:3000/create-blog', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: blogTitle, body: blogBody, user: username})
        })
        .then(response => {
            return response.json()
        }).then(data => {
            if(data.containsError){
                setBlogError(data)
            }else{
                window.location.reload()
            }
        })
        .catch(error => {
            console.log(error)
        })

    }
    function showBlogSnippet(blogBody){
        const maxLength = 20

        if(blogBody.length > maxLength){
            return blogBody.substring(0, maxLength) + ' ....'
        }else{
            return blogBody
        }           
    }

    function handleDeleteBlog(title, body, user) {
        
        // TODO: Send the blog details to the backend
        fetch('http://localhost:3000/delete-blog', {
            method: 'POST', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: title, body: body, user: user})
        })
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            console.log(error)
        })
    }

    function handleAddComment(comment, blogID) {
        fetch('http://localhost:3000/add-comment', {
            method: 'POST', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({comment: comment, author: username, id: blogID})
        })
        .then(response => {
            console.log(response.status)

            const c = {author: username, comment: comment}
            const allComments = isViewBlogOpen.comments
            allComments.push(c)
            
            setIsViewBlogOpen({...isViewBlogOpen, comment: allComments})
            setCommentText('')
        })
        .catch(error => {
            console.log(error)
        })
    }

    function CommentComponent({author, comment}) {
        return (
            <div className="m-2 comment">
                <h4>Comment by: {author}</h4>
                <p>{comment}</p>
            </div>
        )
    }

    function BlogComponent({title, body, user, blogID, comments}) {
        return (
            <div className="blog-component">
                <div className="blog-component-left">
                    <h3 className="blog-title">{title}</h3>
                    <p className="blog-body">{showBlogSnippet(body)}</p>
                </div>
                <div className="blog-component-right">
                    {user == username ?
                        <>
                            <button className="fw-500 m-2 btn-blue" onClick={() => {setIsViewBlogOpen({isOpen: true, title: title, body: body, user:user, blogID: blogID, comments: comments})}}>View</button>
                            <button className="fw-500 m-2 btn-red" onClick={() => {handleDeleteBlog(title, body, user)}}>Delete</button>
                        </>
                        :
                        <button className="fw-500 m-2 btn-blue" onClick={() => {setIsViewBlogOpen({isOpen: true, title: title, body: body, user:user, blogID: blogID, comments: comments})}}>View</button>     
                    }
                </div>
            </div>
        )
    }
    
    return (
        <div className="blogs-body">
            <Header isAtHomepage={false} currentUser={username} />
            <div className="blogs-content">                
                <div className="blog-post">
                    <div className="blog-post-left">
                        <h2>{username[0].toUpperCase()}</h2>
                    </div>
                    <div className="blog-post-right">
                        <textarea id="blog-post" placeholder="Write a post..." 
                        value={blogBody} onClick={() => {setIsCreateBlogOpen(true)}} readOnly/>
                        
                        {isCreateBlogOpen ? 
                            <div className="modal" onClick={() =>{setIsCreateBlogOpen(false); setBlogError({title: '', body: ''})}}>
                                <div className="modal-content" onClick={(e) => {e.stopPropagation()}}>
                                    <h3>Create a Blog</h3>
                                    <hr />

                                    <div className="blog-post-component">
                                        <span className="error">{blogError.title}</span>
                                        <label htmlFor="title">Title</label>
                                        <input type="text" id="title" name="title" value={blogTitle} onChange={(e) => {setBlogTitle(e.target.value)}} />
                                    </div>
                                    <div className="blog-post-component">
                                        <span className="error">{blogError.body}</span>
                                        <label htmlFor="body">Body</label>
                                        <textarea name="body" id="body" cols="40" rows="8" value={blogBody} onChange={(e) => {setBlogBody(e.target.value)}}></textarea>
                                    </div>

                                    <button className="btn-red" onClick={() => {setIsCreateBlogOpen(false)}}>Done</button>
                                    
                                </div>
                            </div>
                                :
                                <></>                               
                        }
                        {
                            isViewBlogOpen.isOpen ? 
                            <div className="blog-view-modal" onClick={() => {setIsViewBlogOpen({isOpen: false, title: '', body: '', user: '', blogID: '', comments: []})}}>
                                <div className="blog-view-modal-content" onClick={(e) => {e.stopPropagation()}}>
                                    <h3 style={{textAlign: 'center'}} className="m-2">Blog by: {isViewBlogOpen.user}</h3>
                                    <hr />

                                    <h3 className="m-2">Title: </h3>
                                    <p className="m-2">{isViewBlogOpen.title}</p>

                                    <h3 className="m-2">Body: </h3>
                                    <p className="m-2">{isViewBlogOpen.body}</p>

                                    <button className="m-2 btn-red" onClick={() => {setIsViewBlogOpen({isOpen: false, title: '', body: '', user: '', blogID: '', comments: []})}}>Close</button>
                                    
                                    <div className="likes-and-comments">
                                        <h3 className="m-2">Write a Comment.</h3>
                                        <textarea name="comment" value={commentText} id="comment" cols="50" rows="3"
                                         onChange={(e) => {setCommentText(e.target.value)}}></textarea>
                                        <br></br>
                                        <button style={{marginTop: '0.5rem'}}className="btn-blue" onClick={() => {handleAddComment(commentText, isViewBlogOpen.blogID)}}>Comment</button>
                                        
                                        <div className="comments">
                                            {
                                                isViewBlogOpen.comments.map(comment => {
                                                    return <CommentComponent author={comment.author} comment={comment.comment}/>
                                                })
                                            }

                                        </div>

                                    </div>
                                </div>

                            </div> :
                            <></>
                        }

                    </div>
                    <button className="btn-red" onClick={handleBlogSend}>POST</button>
                </div>

                <div className="all-blogs">
                    <h2 className="all-blogs-title fw-500">ALL BLOGS</h2>
                    <div className="all-blogs-content">
                        {
                            allBlogs.map(blog => {
                                return <BlogComponent title={blog.title} body={blog.body} user={blog.user} blogID={blog._id} comments={blog.comments}/>
                            })
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
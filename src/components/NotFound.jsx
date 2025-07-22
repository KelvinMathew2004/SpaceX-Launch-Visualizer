import { Link } from "react-router-dom"
import '../App.css'

function NotFound(){
  return (
    <div className="not-found">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link className="not-found-button" to="/">
            Back to Dashboard
        </Link>
    </div>
  )
}

export default NotFound
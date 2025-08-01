import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import '../App.css'

function NotFound(){
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button onClick={() => navigate('/')} className="not-found-button">
                <span className="material-symbols-outlined">arrow_back</span>&nbsp;&nbsp;
                Back to Dashboard
            </button>
        </div>
    )
}

export default NotFound
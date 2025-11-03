import './error404.css'
import { Link } from "react-router-dom";

export default function Notfound(){
    return(
        <>
        <div className='error'>
        <h2>404 </h2>
        <h3>Opps! Page doesn't found</h3>
        <Link to='/iTask'>
        <button className="btn btn-primary">Go Back</button>
        </Link>
</div>
        </>
    )
}
import './footer.css'

export const FooterComponent = () =>{

    return(
        <footer>
            <div className='containerCompo'>
                <p className='textFooter'>RoadRunners | Copyright © 2023</p>
                <ul>
                    <li><i className="bi bi-facebook"></i></li>
                    <li><i className="bi bi-linkedin"></i></li>
                    <li><i className="bi bi-twitter"></i></li>
                    <li><i className="bi bi-instagram"></i></li>
                </ul>
            </div>
        </footer>
    )
}
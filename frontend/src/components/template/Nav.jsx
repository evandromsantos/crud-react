import './Nav.css'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            {/* Refatorar depois */}
            <Link to="/">
                <i className="fa fa-home"></i> Início
            </Link>
            <Link to="/users">
                <i className="fa fa-users"></i> Usuário
            </Link>
        </nav>
    </aside>
import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <header className="app-navbar">
            <div className="app-navbar-inner">
                <Link to='/' className="brand-mark">
                    <img src="/signai-mark.svg" width="34" height="34" className="brand-logo" alt="SignAI" />
                    <span>
                        <span className="brand-name">SignAI</span>
                        <span className="brand-tagline">AI-Powered Indian Sign Language Translation</span>
                    </span>
                </Link>

                <Link to='/' className="brand-pill">
                    Convert
                </Link>
            </div>
        </header>
    )
}

export default Navbar
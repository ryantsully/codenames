import Logo from "./ryans-workshop-logo.png";

export default function NavBar() {

    return <nav className="nav">


        <div className="logo">
            <img src={Logo} alt="Ryan's Workshop" />
        </div >

        <ul>

            {/* <li> */}

            {/* </li> */}

            {/* React tutorial #23 Router Links Could be another option if these are slow */}
            <li>
                <a href="/">Home</a>
            </li>

            {/* <li>
                <a href="research">Research</a>
            </li> */}

            <li>
                <a href="programming">Programming</a>
            </li>

            {/* <li>
    <a href="/healthcare">Healthcare</a>
    </li> */}

            {/* <li>
    <a href="/fitness">Fitness</a>
    </li> */}

            <li>
                <a href="/codenames">CodeNames</a>
            </li>

            <li>
                <a href="/wordle">Wordle</a>
            </li>

            <li>
                <a href="/create">Create</a>
            </li>


        </ul>

    </nav>
}
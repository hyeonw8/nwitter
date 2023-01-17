import { faCloudMoon, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Navigation = ({userObj}) => (
    <nav>
        <ul style={{ display: "flex", justifyContent: "center", marginTop: 50}}>
            <li>
                <Link to="/" style={{marginRight: 30}}>
                    <FontAwesomeIcon icon={faCloudMoon} color={"#806dbf"}
                    size="2x" />
                </Link>
            </li>
            <li>
                <Link 
                    to="/profile"
                    style={{
                        mariginLeft: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "12",
                    }}
                >
                    <FontAwesomeIcon icon={faUser} color={"#806dbf"}
                    size="2x" /> 
                    <span 
                        style={{marginTop : 10}}>
                        {userObj.displayName
                        ? `${userObj.displayName}의 Profile`
                        : "Profile"}
                    </span>
                </Link>
            </li>
        </ul>
    </nav>
);

export default Navigation;
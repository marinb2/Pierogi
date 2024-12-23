import logo from '../assets/logo.svg'
import homeExample from '../assets/home-example.svg'
import '../styles/LandingPage.css'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';

const clientId = "932056831828-jn9cido6b78ao4hlhlssfjs09r5g1788.apps.googleusercontent.com"

function LandingPage() {

  const frontdomain = "https://pierogi-theta.vercel.app"
  const backdomain = "https://pierogi2-1m4p.onrender.com"

  const [users, setUsers] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState(null);

  const getUsers = async () => {
    try {
      const response = await fetch(`${backdomain}/api/users`, { method: "GET", credentials: "include" });
      if (response) {

        const usersjson = await response.json();
        setUsers(usersjson);

      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, [])

  useEffect(() => {
    if (users && loggedInEmail) {
      for (var i = 0; i < users.length; i++) {
        if (loggedInEmail == users[i].email) {
          window.location.href = "https://pierogi-theta.vercel.app/main";
        }
      }
      //window.location.href = "https://pierogi-theta.vercel.app/register";
    }
  }, [users, loggedInEmail]);

  /* function redirectToGoogleOAuth() {
    window.location.href = "";
  } */

  return (

    <div className="landing-page">

      <img src={logo} className="logo"></img>

      <div className="landing-page-desc">
        <h1>Školski sustav na dlanu</h1>
        <p>Trebate pouzdan sustav za digitalizaciju školskih procesa? Na pravom ste mjestu! Olakšajte svakodnevne zadatke, unaprijedite komunikaciju i uštedite vrijeme uz intuitivno rješenje za sve školske potrebe.</p>
      </div>

      <GoogleLogin
        onSuccess={credentialResponse => {

          sessionStorage.setItem("loggedInUserEmail", jwtDecode(credentialResponse.credential).email);
          setLoggedInEmail(jwtDecode(credentialResponse.credential).email);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />


      {/* <button onClick={redirectToGoogleOAuth} className="gsi-material-button">
        <div className="gsi-material-button-state"></div>
        <div className="gsi-material-button-content-wrapper">
          <div className="gsi-material-button-icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              style={{ display: "block" }}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span className="gsi-material-button-contents">Prijava putem Googlea</span>
          <span style={{ display: "none" }}>Prijava putem Googlea</span>
        </div>
      </button> */}


      <div>
        <img src={homeExample} className="home-example"></img>
      </div>
    </div>
  )
}

export default LandingPage

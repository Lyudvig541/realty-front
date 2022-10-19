import Login from "./login";
import PhoneNumberVerification from "./phoneNumberVerification";
import ForgotPassword from "./forgotPassword";
import ResetPassword from "./resetPassword";
import MailInfo from "./mailInfo";

const Modals = () => {

    return <div>
        <Login/>
        <PhoneNumberVerification/>
        <ForgotPassword/>
        <ResetPassword/>
        <MailInfo/>
    </div>
}


export default Modals
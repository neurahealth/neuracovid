import React, { Component } from 'react'
import IdleTimer from 'react-idle-timer'
import { logout } from '../helpers/auth';
import { withRouter } from "react-router-dom";
import Modal from 'react-modal';
import { firebase } from '@firebase/app';
// import { userRecordConstructor } from 'firebase-functions/lib/providers/auth';

const appTokenKey = 'appToken';

const styles = {
    button: {
        backgroundColor: '#49b2cc',
        color: '#fff',
        borderColor: '#fff',
        borderRadius: '6px',
        height: '38px'
    }
}

class IdleTimerContainer extends Component {
    constructor(props) {
        super(props)

        this.state = ({
            idleTimerRef: null,
            openModel: false,
            isLoggedIn: false,
            sessionTimeoutRef: null
        }); 

        firebase.auth().onAuthStateChanged(user => {
            if (user != null){
                this.setState({ isLoggedIn: true })
            }
        })
    }

    componentDidMount() {
        Modal.setAppElement('body');
    }

    logOut = () => {
        logout()
            .then(() => {
                localStorage.removeItem(appTokenKey);        
                this.props.history.push('/login');
            });
        this.setState({ openModel: false })
        clearTimeout(this.state.sessionTimeoutRef)
    }

    stayActive = () => {
        this.setState({ openModel: false })
        clearTimeout(this.state.sessionTimeoutRef)
    }

    onIdle = () => {
        if (this.state.isLoggedIn == true){
            this.setState({ openModel: true })
        }
        this.state.sessionTimeoutRef = setTimeout(this.logOut, 5 * 60 * 1000)
    }

    render() {
        return(
            <div>
                <Modal isOpen={this.state.openModel}>
                    <h2>You've been idel for a while!</h2>
                    <p>You will be logged out soon</p>
                    <div>
                        <button style={styles.button} onClick={this.logOut}>Log me out</button> &nbsp; &nbsp;
                        <button style={styles.button} onClick={this.stayActive}>Keep me signed in</button>
                    </div>
                </Modal>
                <IdleTimer
                    ref={this.state.idleTimerRef}
                    timeout={20 * 60 * 1000}
                    onIdle={this.onIdle}
                />
            </div>
        )
    }
}

export default withRouter(IdleTimerContainer)
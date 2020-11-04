import React, { Component } from 'react'
import { Navbar, NavbarBrand, Nav } from 'react-bootstrap';
import { Drawer, List, ListItem, Button, Divider, ListItemIcon} from "@material-ui/core";
import { withRouter,Link } from "react-router-dom";
import { logout } from '../../helpers/auth';
import './header.css'
import { firebase } from '@firebase/app';
import Select from 'react-select';
import { MdMenu, MdOndemandVideo } from "react-icons/md";
import { AiOutlineQuestionCircle, AiOutlinePoweroff } from "react-icons/ai";
import { MdLanguage } from 'react-icons/md';
import Faq from '../Faq/index'
const appTokenKey = "appToken";


class Header extends Component {

    constructor(props){
        super(props)
        this.state = { user:"",pic:"", userSignIn: false,selectedOption: 'en',isOpen:false}
        this.handleLogout = this.handleLogout.bind(this);
       
        firebase.auth().onAuthStateChanged(user =>  {
            if (user != null){
                this.setState({ user:user, pic:user.photoURL, userSignIn: true})
            }
        })
    }

    toggleDrawer = (event)=>{
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({isOpen:!this.state.isOpen})
    }
    handleLogout() {
        logout()
            .then(() => {
                localStorage.removeItem(appTokenKey);        
                this.props.history.push('/login');
            });
    }

    handleChange=(selectedOption)=>{
        this.setState(
            { selectedOption: selectedOption.value }
        );
        this.props.handleChange(selectedOption.value);
        
    }
     
    render() {
        const { selectedOption } = this.state;
         const { t, i18n } = this.props;
        return (
            <Navbar collapseOnSelect fixed="top" className=" primaryBgColor headerbg">
                  <Navbar.Brand className="lightColor" style={{ paddingLeft:'4%'}} >
                     <a href="https://neurahealth.ai/" target="_blank"><img src={require('../../assets/images/logo.png')} /> </a> 
                  </Navbar.Brand>
                <MdMenu className="menu" onClick={this.toggleDrawer}/> 
                <Drawer open={this.state.isOpen} onClose={this.toggleDrawer}>
                    <div className="title drawerHed">
                        Welcome to  NeuraCovid
                    </div>
                   <List>
                        <Divider/>
                         <ListItem className="listItem">
                            <ListItemIcon> <MdLanguage size="1.5em"/> </ListItemIcon>
                            <Select
                                value={this.selectedOption}
                                onChange={this.handleChange}
                                className="basic-single"
                                placeholder="Select Language"
                                options={this.props.options}
                            />
                        </ListItem>
                        <Divider/>
                        <ListItem className="listItem"> 
                            <ListItemIcon> <MdOndemandVideo size="1.5em"/> </ListItemIcon>
                            <a href="https://youtu.be/VKXCu-VB7M8" target="_blank"> {t("NeuraCovid Demo")} </a>
                        </ListItem>
                        <Divider />
                        
                        <ListItem className="listItem"> 
                            <ListItemIcon> <AiOutlineQuestionCircle size="1.5em" /></ListItemIcon>
                            <Link to="/faq" target="_blank"> {t("FAQ's")} </Link>
                        </ListItem>
                        <Divider />
                        <ListItem className="listItem" style={{ display: `${this.state.userSignIn === true ? 'block' : 'none'}` }}>
                            <ListItemIcon> <AiOutlinePoweroff size="1.5em" /></ListItemIcon>
                            
                            <button type="button" className="btn-signOutBtn" onClick={this.handleLogout}> {t("Sign out")} </button>
                            <img src={this.state.pic} width="45" height="45" style={{ borderRadius: 100 }}
                                alt="profile" />
                        </ListItem>
                   </List>
                </Drawer>
              
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">

                    </Nav>
                    <Nav>
                        <div className="signOutWrapper" style={{ display: `${this.state.userSignIn === false ? 'block' : 'none'}` }}>
                            <div className="seeHow"> <a href="https://youtu.be/VKXCu-VB7M8" target="_blank"> {t("NeuraCovid Demo")} </a>|<Link to="/subscription" target="_self"> {t("Subscription")} </Link> | <Link to="/faq" target="_blank"> {t("FAQ's")} </Link>
                                {/* <MdLanguage size="1.5em"/> */}
                            <Select
                                value={this.selectedOption}
                                onChange={this.handleChange}
                                className="basic-single"
                                placeholder="Select Language"
                                options={this.props.options}
                            />
                        </div>
                        </div>
                        <div className="signOutWrapper" style={{display:`${this.state.userSignIn === true ? 'block' : 'none'}`}}>
                            <button type="button" className="btn-signOutBtn" onClick={this.handleLogout}> {t("Sign out")} </button>
                            <img src={this.state.pic} width="45" height="45" style={{ borderRadius: 100 }}
                            alt="profile"/>
                        </div>
                        </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default withRouter(Header)

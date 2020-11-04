import React, { Component } from 'react'
import {  Row, Col } from 'react-bootstrap';
import './header.css'

export class Footer extends Component {
    render() {
        const { t, i18n } = this.props;
        return (
            <Row className=" darkBgColor footer ">
                <Col className="lightColor footerText version">
                      {t("© 2020 Neura Health Inc. All rights reserved.")}
                      <span style={{alignSelf:'right'}}> Version 1.0</span>
                </Col>
            </Row>
           
        )
    }
}

export default Footer

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../../static/images/robot.gif";
export default function WelcomeChat() {
    return (
        <Container>
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <h1 style={{ color: "black", fontWeight: "700" }}>
                    Welcome, <span>Back!</span>
                </h1>
                <h3 style={{ color: 'black' }}>Please select a chat to Start messaging.</h3>
                <img src={Robot} alt="" style={{ width: '40%' }} />

            </div>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

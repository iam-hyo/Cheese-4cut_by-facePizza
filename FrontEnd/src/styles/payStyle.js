import styled from 'styled-components';

export const ContextBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #FFC200;
  background: #FFFCF4;
  width: 100%;
  height: 427px;
  margin-top: 55px;

  h3{
    font-size: 40px;
    font-weight: 400;
    margin: 56px 0 0 0 ;
  }

  #quantity{
    display: flex;
    background-color: #E5E5E5;
    border-radius: 110px;
    width: 110px;
    height: 110px;

    font-size: 54px;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
  button{
    background: transparent;
    text-align: center;
    font-size: 43.2px;
    padding: 0;
    margin: 0px;
    width: 70px;
    height: 90px;
   }
  #guide{
    margin: 15px 0 40px 0px;
    color: var(--, #6D6D6D);
    font-size: 30px;
  }
`

export const Footer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  h3{
    display: flex;
    background-color: #E5E5E5;
    border-radius: 90px;
    width: 90px;
    height: 90px;
    justify-content: center;
    align-items: center;
  }

  button{
    background: transparent;
    text-align: center;
    font-size: 43.2px;
    padding: 0;
    margin: 0px;
    height: 90px;
   }
  #startBTN{
    font-size: 40px; }
  #startBTN:hover{
    color: #FFC500; }   
`
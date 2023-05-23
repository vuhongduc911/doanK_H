import {useState, useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import {patchData} from '../utils/fetchData'
import { useRouter } from 'next/router'

import { Button, FormGroup, Col, Label, Input } from 'reactstrap';

const ForgotPassword = ({ resetToken }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const initialState = { email: '' }
  const [userData, setUserData] = useState(initialState)
  const { email } = userData

  const {state, dispatch} = useContext(DataContext)
  const { auth } = state

  const router = useRouter()
 
  const handleChangeInput = e => {
    const {name, value} = e.target
    setUserData({...userData, [name]:value})

    // Kiểm tra định dạng email
    const isValidEmail = /\S+@\S+\.\S{3,}/.test(value.trim());
    const buttonSubmit = document.querySelector('button[type="submit"]');
    
    if (!isValidEmail) {
      buttonSubmit.disabled = true;
    }
    else {
      buttonSubmit.disabled = false;
      dispatch({ type: 'NOTIFY', payload: {} })
    }
  }
  
  const handleSubmit1 = async e => {
    e.preventDefault()

    dispatch({ type: 'NOTIFY', payload: {loading: true} })

    const res = await patchData('user/forgotPass', userData)
    
    if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })

    return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
  }
 
  return (
    <div>
      <br></br>
      <form onSubmit={handleSubmit1}>
        <FormGroup row>
          <Label for="exampleInputEmail1" sm={2}>Email Address</Label>
          <Col sm={8}>
            <Input type="email" name="email" id="exampleInputEmail1" placeholder="example@gmail.com"
             aria-describedby="emailHelp" value={email} onChange={handleChangeInput}/>
          </Col>
          <Col sm={2}>
            <Button color="primary" type="submit" >Send Mail</Button>
          </Col>
        </FormGroup>
      </form>
    </div>
  );
}

export default ForgotPassword;

import axios from "axios";

async function loginUser({email, password}:{email: string, password:string}) {
  try {
    return await axios.post('http://localhost:3000/login', {email, password}, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    throw error
  }
}

async function registerUser({email, password}:{email: string, password:string}) {
  try {
    return await axios.post('http://localhost:3000/register', {email, password}, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    throw error
  }
}

export {loginUser, registerUser}